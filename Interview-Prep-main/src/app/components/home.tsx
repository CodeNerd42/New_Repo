"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Command, CommandInput } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  Building,
  Tag,
  Users,
  CalendarDays,
  BarChart3,
  Zap,
  ChevronsUpDown,
  Info,
  LinkIcon,
  FileText,
  Briefcase,
} from "lucide-react"
import { subMonths, isAfter } from "date-fns"

// --- Data Structure Definition ---
interface Question {
  id: string
  title: string
  companies: string[]
  topics: string[] // e.g., "Arrays", "System Design", "Binary Search", "Simulation"
  roles: string[]
  roundType: "OA" | "Technical Interview" | "Design" | "HR" | "Mixed" 
  difficulty: "Easy" | "Medium" | "Hard"
  askedDate: string // ISO date string "YYYY-MM-DDTHH:mm:ss.sssZ"
  frequency?: string
  experience:string[]// e.g., "0-2 years", "2-5 years", "5+ years" 
  description?: string
  solutionLink?: string // External link
  // If no solutionLink, clicking might eventually go to an internal page /questions/[id]
}

// --- Sample Data (Expand this with your actual data) ---
const sampleQuestions: Question[] = [
   {
      id: "q1",
      title: "Count Distinct Bitwise OR of Subarrays",
      companies: ["Google"],
      topics: ["Arrays", "Bit Manipulation"],
      roles: ["SDE"],
      roundType: "OA",
      difficulty: "Hard",
      askedDate: "Nov 2020",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/count-distinct-bitwise-or-of-all-subarrays_893104?ieSlug=google-interview-experience-on-campus-nov-2020&ieCompany=google"
    },
    {
      id: "q2",
      title: "Delete Kth Node from End in Linked List",
      companies: ["Google"],
      topics: ["Linked Lists", "Two-Pointer"],
      roles: ["SDE"],
      roundType: "OA",
      difficulty: "Medium",
      askedDate: "Nov 2020",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/delete-kth-node-from-end-in-linked-list_799912?ieSlug=google-interview-experience-on-campus-nov-2020&ieCompany=google"
    },
    {
      id: "q3",
      title: "Dice Throws",
      companies: ["Google"],
      topics: ["Dynamic Programming", "Probability"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Sep 2025",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/dice-throws_799924?ieSlug=google-interview-experience-by-shivkanya-dhupe-off-campus-sep-2025&ieCompany=google"
    },
    {
      id: "q4",
      title: "Topological Sorting",
      companies: ["Google"],
      topics: ["Graphs", "DFS/BFS"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/topological-sorting_973003?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q5",
      title: "Trapping Rainwater",
      companies: ["Google"],
      topics: ["Arrays", "Two-Pointer"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/trapping-rainwater_630519?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q6",
      title: "Job Sequencing Problem",
      companies: ["Google"],
      topics: ["Greedy", "Sorting"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/job-sequencing-problem_1169460?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q7",
      title: "Painter's Partition Problem",
      companies: ["Google"],
      topics: ["Binary Search", "Arrays"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/painter-s-partition-problem_1089557?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q8",
      title: "Water Supply in a Village",
      companies: ["Google"],
      topics: ["Graphs", "Union-Find"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/water-supply-in-a-village_1380956?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q9",
      title: "Count Subarrays with Given XOR",
      companies: ["Google"],
      topics: ["Arrays", "Hashing"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Aug 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/count-subarrays-with-given-xor_1115652?ieSlug=google-interview-experience-off-campus-aug-2022&ieCompany=google"
    },
    {
      id: "q10",
      title: "Replace Spaces",
      companies: ["Google"],
      topics: ["Strings"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Easy",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/replace-spaces_1172172?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q11",
      title: "Minimum Card Flips",
      companies: ["Google"],
      topics: ["Arrays", "Greedy"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/minimum-card-flips_2259094?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q12",
      title: "A Number Game",
      companies: ["Google"],
      topics: ["Math", "Game Theory"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/a-number-game_4609674?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q13",
      title: "Longest Path",
      companies: ["Google"],
      topics: ["Trees", "DFS/BFS"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/longest-path_2245720?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q14",
      title: "Longest Consequence",
      companies: ["Google"],
      topics: ["Arrays", "Hashing"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/longest-consequence_3116827?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q15",
      title: "Cut into Segments",
      companies: ["Google"],
      topics: ["Dynamic Programming"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Feb 2022",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/cut-into-segments_1214651?ieSlug=google-interview-experience-on-campus-feb-2022&ieCompany=google"
    },
    {
      id: "q16",
      title: "Container With Most Water",
      companies: ["Google"],
      topics: ["Arrays", "Two-Pointer"],
      roles: ["SDE"],
      roundType: "OA",
      difficulty: "Medium",
      askedDate: "Dec 2021",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/container-with-most-water_873860?ieSlug=google-interview-experience-on-campus-dec-2021&ieCompany=google"
    },
    {
      id: "q17",
      title: "Minimum Cost to Connect Cities",
      companies: ["Google"],
      topics: ["Graphs", "Minimum Spanning Tree"],
      roles: ["SDE"],
      roundType: "OA",
      difficulty: "Hard",
      askedDate: "Dec 2021",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/minimum-cost-to-connect-cities_983628?ieSlug=google-interview-experience-on-campus-dec-2021&ieCompany=google"
    },
    {
      id: "q18",
      title: "First Missing Positive",
      companies: ["Google"],
      topics: ["Arrays", "Cyclic Sort"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Hard",
      askedDate: "Dec 2021",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/first-missing-positive_699946?ieSlug=google-interview-experience-on-campus-dec-2021&ieCompany=google"
    },
    {
      id: "q19",
      title: "Simplify the Directory",
      companies: ["Google"],
      topics: ["Strings", "Stack"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Medium",
      askedDate: "Dec 2021",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/simplify-the-directory_668400?ieSlug=google-interview-experience-on-campus-dec-2021&ieCompany=google"
    },
    {
      id: "q20",
      title: "Frequency in a Sorted Array",
      companies: ["Google"],
      topics: ["Arrays", "Binary Search"],
      roles: ["SDE"],
      roundType: "Technical Interview",
      difficulty: "Easy",
      askedDate: "Dec 2021",
      experience: ["College Grad"],
      solutionLink: "https://www.naukri.com/code360/problems/frequency-in-a-sorted-array_893286?ieSlug=google-interview-experience-on-campus-dec-2021&ieCompany=google"
    },
    {
  id: "q21",
  title: "Merge sort",
  companies: ["Intuit"],
  topics: ["Sorting", "Divide and Conquer"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Feb 2023",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/merge-sort_920442?ieSlug=intuit-interview-experience-by-ayush-goyal-feb-2023-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q22",
  title: "Rotate matrix by 90 degrees",
  companies: ["Intuit"],
  topics: ["Arrays", "Matrix Manipulation"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Feb 2023",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/rotate-matrix-by-90-degrees_981261"
},
{
  id: "q23",
  title: "Shortest substring with all chars",
  companies: ["Intuit"],
  topics: ["Strings", "Sliding Window"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2023",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/shortest-substring-with-all-characters_704894?ieSlug=intuit-interview-experience-by-ayush-goyal-feb-2023-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q24",
  title: "Palindrome Linked List",
  companies: ["Intuit"],
  topics: ["Linked Lists", "Two-Pointer"],
  roles: ["SDE-2"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Jul 2023",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/palindrom-linked-list_799352?ieSlug=intuit-interview-experience-jul-2023-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q25",
  title: "Product Array Puzzle",
  companies: ["Intuit"],
  topics: ["Arrays", "Prefix/Suffix Product"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jul 2023",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/product-array-puzzle_983600?ieSlug=intuit-interview-experience-jul-2023-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q26",
  title: "Maximize",
  companies: ["Intuit"],
  topics: ["Arrays", "Greedy Algorithm"],
  roles: ["SDE-2"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "May 2021",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/maximize_7064965?ieSlug=intuit-interview-experience-may-2021-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q27",
  title: "Distance to Cycle in Undirected Graph",
  companies: ["Intuit"],
  topics: ["Graphs", "BFS/DFS"],
  roles: ["SDE-2"],
  roundType: "OA",
  difficulty: "Hard",
  askedDate: "May 2021",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/distance-to-a-cycle-in-undirected-graph_6820962?ieSlug=intuit-interview-experience-may-2021-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q28",
  title: "Min Jumps",
  companies: ["Intuit"],
  topics: ["Dynamic Programming"],
  roles: ["SDE-2"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Jun 2022",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/min-jumps_985273?ieSlug=intuit-interview-experience-by-rishab-garg-jun-2022-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q29",
  title: "Longest Unique Substring",
  companies: ["Intuit"],
  topics: ["Strings", "Sliding Window"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jun 2022",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/longest-unique-substring_630418?ieSlug=intuit-interview-experience-by-rishab-garg-jun-2022-exp-0-2-years&ieCompany=intuit"
},
{
  id: "q30",
  title: "Top View of Binary Tree",
  companies: ["Intuit"],
  topics: ["Trees", "BFS/DFS"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/top-view-of-the-tree_799401?ieSlug=intuit-interview-experience-aug-2021-exp-0-2-years-1832&ieCompany=intuit"
},
{
  id: "q31",
  title: "Jump Game",
  companies: ["Intuit"],
  topics: ["Arrays", "Greedy Algorithm"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/jump-game_893178?ieSlug=intuit-interview-experience-aug-2021-exp-0-2-years-1832&ieCompany=intuit"
},
{
  id: "q32",
  title: "Find K Pairs with Smallest Sums",
  companies: ["Intuit"],
  topics: ["Arrays", "Heap (Priority Queue)"],
  roles: ["SDE-2"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Aug 2021",
  experience: ["2+ Years"],
  solutionLink: "https://www.naukri.com/code360/problems/find-k-pairs-with-smallest-sums_1381413?ieSlug=intuit-interview-experience-aug-2021-exp-0-2-years-1832&ieCompany=intuit"
},
{
  id: "q33",
  title: "Cycle Detection in a Singly Linked List",
  companies: ["Adobe"],
  topics: ["Linked Lists", "Fast & Slow Pointers"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/cycle-detection-in-a-singly-linked-list_628974?ieSlug=adobe-interview-experience-on-campus-nov-2020&ieCompany=adobe"
},
{
  id: "q34",
  title: "Search in Row-wise & Column-wise Sorted Matrix",
  companies: ["Adobe"],
  topics: ["Matrix", "Binary Search"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/search-in-a-row-wise-and-column-wise-sorted-matrix_839811?ieSlug=adobe-interview-experience-on-campus-nov-2020&ieCompany=adobe"
},
{
  id: "q35",
  title: "Nth Node from End of Linked List",
  companies: ["Adobe"],
  topics: ["Linked Lists", "Two-Pointer"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/nth-node-from-end_920751?ieSlug=adobe-interview-experience-on-campus-nov-2020&ieCompany=adobe"
},
{
  id: "q36",
  title: "Rotate Matrix by 90 Degrees",
  companies: ["Adobe"],
  topics: ["Matrix", "In-place Manipulation"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/rotate-matrix-by-90-degrees_981261?ieSlug=adobe-interview-experience-on-campus-nov-2020&ieCompany=adobe"
},
{
  id: "q37",
  title: "Maximum Sum Path in a Binary Tree",
  companies: ["Adobe"],
  topics: ["Trees", "DFS"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/maximum-sum-path-of-a-binary-tree_1214968?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q38",
  title: "Intersection of Two Arrays",
  companies: ["Adobe"],
  topics: ["Arrays", "Hashing"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/intersection-of-2-arrays_1082149?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q39",
  title: "Next Greater Element",
  companies: ["Adobe"],
  topics: ["Arrays", "Stack"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/next-greater-element_920451?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q40",
  title: "Missing Number",
  companies: ["Adobe"],
  topics: ["Arrays", "Bit Manipulation"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/missing-number_1115607?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q41",
  title: "Max Product Subset",
  companies: ["Adobe"],
  topics: ["Arrays", "Dynamic Programming"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/max-product-subset_1170054?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q42",
  title: "Populating Next Right Pointers in Each Node",
  companies: ["Adobe"],
  topics: ["Trees", "BFS"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/populating-next-right-pointers-in-each-node_1263696?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q43",
  title: "Design a Stack with getMin() in O(1)",
  companies: ["Adobe"],
  topics: ["Stacks", "Design"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/design-a-stack-that-supports-getmin-in-o-1-time-and-o-1-extra-space_842465?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q44",
  title: "Split Array",
  companies: ["Adobe"],
  topics: ["Arrays", "Greedy Algorithm"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2015",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/split-array_1761561?ieSlug=adobe-interview-experience-on-campus-may-2015-1295&ieCompany=adobe"
},
{
  id: "q45",
  title: "Distinct Island",
  companies: ["Microsoft"],
  topics: ["Graph", "DFS/BFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jul 2019",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/distinct-island_630460?ieSlug=microsoft-interview-experience-by-software-engineer-jul-2019-exp-0-2-years-302&ieCompany=microsoft"
},
{
  id: "q46",
  title: "Word Wrap",
  companies: ["Microsoft"],
  topics: ["Dynamic Programming", "Greedy"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Jul 2019",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/word-wrap_982931?ieSlug=microsoft-interview-experience-by-software-engineer-jul-2019-exp-0-2-years-302&ieCompany=microsoft"
},
{
  id: "q47",
  title: "Rock Paper Scissor",
  companies: ["Microsoft"],
  topics: ["Simulation", "Game Theory"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/rock-paper-scissor_5525994?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q48",
  title: "Construct the String",
  companies: ["Microsoft"],
  topics: ["Strings", "Greedy"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/construct-the-string_3146850?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q49",
  title: "Delete Kth Node from End in Linked List",
  companies: ["Microsoft"],
  topics: ["Linked Lists", "Two-Pointer"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/delete-kth-node-from-end-in-linked-list_799912?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q50",
  title: "Trapping Rainwater",
  companies: ["Microsoft"],
  topics: ["Arrays", "Two-Pointer"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/trapping-rainwater_630519?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q51",
  title: "Bottom View of Binary Tree",
  companies: ["Microsoft"],
  topics: ["Trees", "BFS/DFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/bottom-view-of-binary-tree_893110?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q52",
  title: "Word Ladder",
  companies: ["Microsoft"],
  topics: ["Graphs", "BFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/word-ladder_1102319?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q53",
  title: "Rotting Oranges",
  companies: ["Microsoft"],
  topics: ["Matrix", "BFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/rotting-oranges_701655?ieSlug=microsoft-interview-experience-software-engineer-dec-2021-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q54",
  title: "Complex Number Class",
  companies: ["Microsoft"],
  topics: ["OOP", "Operator Overloading"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Jul 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/complex-number-class_1171182?ieSlug=microsoft-interview-experience-software-engineer-jul-2022-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q55",
  title: "Street Lights",
  companies: ["Microsoft"],
  topics: ["Greedy", "Sorting"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jul 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/street-lights_2245469?ieSlug=microsoft-interview-experience-software-engineer-jul-2022-exp-0-2-years&ieCompany=microsoft"
},
{
  id: "q56",
  title: "Find All Triplets with Zero Sum",
  companies: ["Microsoft"],
  topics: ["Arrays", "Two-Pointer"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/find-all-triplets-with-zero-sum_873143?ieSlug=microsoft-interview-experience-by-vinay-kumar-on-campus-jan-2022&ieCompany=microsoft"
},
{
  id: "q57",
  title: "Generate All Binary Strings from Pattern",
  companies: ["Microsoft"],
  topics: ["Backtracking", "Recursion"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/generate-all-binary-strings-from-pattern_1089566?ieSlug=microsoft-interview-experience-by-vinay-kumar-on-campus-jan-2022&ieCompany=microsoft"
},
{
  id: "q58",
  title: "Sum Root to Leaf",
  companies: ["Microsoft"],
  topics: ["Trees", "DFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/sum-root-to-leaf_1095657?ieSlug=microsoft-interview-experience-by-vinay-kumar-on-campus-jan-2022&ieCompany=microsoft"
},
{
  id: "q59",
  title: "The Celebrity Problem",
  companies: ["Microsoft"],
  topics: ["Arrays", "Stack"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/the-celebrity-problem_982769?ieSlug=microsoft-interview-experience-by-vinay-kumar-on-campus-jan-2022&ieCompany=microsoft"
},
{
  id: "q60",
  title: "Clone Graph",
  companies: ["Microsoft"],
  topics: ["Graphs", "DFS/BFS"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/clone-graph_1103394?ieSlug=microsoft-interview-experience-on-campus-feb-2021&ieCompany=microsoft"
},
{
  id: "q61",
  title: "Merge Intervals",
  companies: ["Microsoft"],
  topics: ["Arrays", "Sorting"],
  roles: ["Software Engineer"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/merge-intervals_699917?ieSlug=microsoft-interview-experience-on-campus-feb-2021&ieCompany=microsoft"
},

  {
    id: "q62",
    title: "Find K Closest Elements",
    companies: ["PayPal"],
    topics: ["Arrays", "Binary Search", "Two-Pointer"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Nov 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/find-k-closest-elements_1263702?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },
  {
    id: "q63",
    title: "Search in the Array",
    companies: ["PayPal"],
    topics: ["Arrays", "Binary Search"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "Nov 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/search-in-the-array_1116099?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },
  {
    id: "q64",
    title: "Reverse Only Letters",
    companies: ["PayPal"],
    topics: ["Strings", "Two-Pointer"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "Nov 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/reverse-only-letters_1235236?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },
  {
    id: "q65",
    title: "0-1 Knapsack",
    companies: ["PayPal"],
    topics: ["Dynamic Programming"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Oct 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/0-1-knapsack_920542?ieSlug=paypal-interview-experience-on-campus-oct-2022&ieCompany=paypal"
  },
  {
    id: "q66",
    title: "Trapping Rainwater",
    companies: ["PayPal"],
    topics: ["Arrays", "Two-Pointer"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Oct 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/trapping-rainwater_630519?ieSlug=paypal-interview-experience-on-campus-oct-2022&ieCompany=paypal"
  },
  {
    id: "q67",
    title: "Maximum Value of Modulus Expression",
    companies: ["PayPal"],
    topics: ["Arrays", "Math"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Oct 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/maximum-value-of-modulus-expression_1215006?ieSlug=paypal-interview-experience-on-campus-oct-2022&ieCompany=paypal"
  },
  {
    id: "q68",
    title: "Rotated Array",
    companies: ["PayPal"],
    topics: ["Arrays", "Binary Search"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Oct 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/rotated-array_1093219?ieSlug=paypal-interview-experience-on-campus-oct-2022&ieCompany=paypal"
  },
  {
    id: "q69",
    title: "Rotting Oranges",
    companies: ["PayPal"],
    topics: ["Matrix", "BFS"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Feb 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/rotting-oranges_701655?ieSlug=paypal-interview-experience-on-campus-feb-2022&ieCompany=paypal"
  },
  {
    id: "q70",
    title: "Root to Leaf Path",
    companies: ["PayPal"],
    topics: ["Trees", "DFS"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Feb 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/root-to-leaf-path_2042001?ieSlug=paypal-interview-experience-on-campus-feb-2022&ieCompany=paypal"
  },
  {
    id: "q71",
    title: "Valid Parenthesis",
    companies: ["PayPal"],
    topics: ["Strings", "Stack"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "Feb 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/valid-parenthesis_795104?ieSlug=paypal-interview-experience-on-campus-feb-2022&ieCompany=paypal"
  },
  {
    id: "q72",
    title: "Count Triplets",
    companies: ["PayPal"],
    topics: ["Arrays", "Hashing"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Feb 2022",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/count-triplets_873377?ieSlug=paypal-interview-experience-on-campus-feb-2022&ieCompany=paypal"
  },
  {
    id: "q73",
    title: "Segregate Even and Odd Nodes in Linked List",
    companies: ["American Express"],
    topics: ["Linked Lists", "Two-Pointer"],
    roles: ["SDE"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/segregate-even-and-odd-nodes-in-a-linked-list_1116100?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q74",
    title: "LCA of Binary Tree",
    companies: ["American Express"],
    topics: ["Trees", "DFS/BFS"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/lca-of-binary-tree_920541?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q75",
    title: "Sliding Window Maximum",
    companies: ["American Express"],
    topics: ["Arrays", "Sliding Window", "Deque"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/sliding-window-maximum_980226?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q76",
    title: "Minimum Swaps to Sort Array",
    companies: ["American Express"],
    topics: ["Arrays", "Greedy", "Graph"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/minimum-number-of-swaps-required-to-sort-an-array_973251?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q77",
    title: "Left View of Binary Tree",
    companies: ["American Express"],
    topics: ["Trees", "BFS/DFS"],
    roles: ["SDE"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/left-view-of-binary-tree_625707?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q78",
    title: "Longest Increasing Subsequence (LIS)",
    companies: ["American Express"],
    topics: ["Arrays", "Dynamic Programming"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Sep 2024",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/longest-increasing-subsequence_1062665?ieSlug=american-express-interview-experience-on-campus-sep-2024&ieCompany=american-express"
  },
  {
    id: "q79",
    title: "Min Jumps",
    companies: ["American Express"],
    topics: ["Arrays", "Dynamic Programming"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Feb 2021",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/min-jumps_985273?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express"
  },
  {
    id: "q80",
    title: "Longest Increasing Subsequence (Variation)",
    companies: ["American Express"],
    topics: ["Arrays", "Binary Search"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "Feb 2021",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/longest-increasing-subsequence_630459?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express"
  },
  {
    id: "q81",
    title: "Valid Parenthesis",
    companies: ["American Express"],
    topics: ["Strings", "Stack"],
    roles: ["SDE"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "Feb 2021",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/valid-parenthesis_795104?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express"
  },
  {
    id: "q82",
    title: "All Unique Permutations",
    companies: ["American Express"],
    topics: ["Backtracking", "Recursion"],
    roles: ["SDE"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "Feb 2021",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/all-unique-permutations_1094902?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express"
  },
  {
  id: "q83",
  title: "Best Time to Buy and Sell Stock",
  companies: ["Visa"],
  topics: ["Arrays", "Greedy"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Easy",
  askedDate: "Dec 2016",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/best-time-to-buy-and-sell-stock_1080698?ieSlug=visa-interview-experience-on-campus-dec-2016-1641&ieCompany=visa"
},
{
  id: "q84",
  title: "Inorder Traversal",
  companies: ["Visa"],
  topics: ["Trees", "DFS"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Dec 2016",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/inorder-traversal_3839605?ieSlug=visa-interview-experience-on-campus-dec-2016-1641&ieCompany=visa"
},
{
  id: "q85",
  title: "Ninja and the Dance Competition",
  companies: ["Visa"],
  topics: ["Arrays", "Greedy"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/ninja-and-the-dance-competetion_1172167?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
},
{
  id: "q86",
  title: "Max Length Subarray with Adjacent Diff ≤ 1",
  companies: ["Visa"],
  topics: ["Arrays", "Sliding Window"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "http://naukri.com/code360/problems/maximum-length-sub-array-having-absolute-difference-of-adjacent-elements-either-0-or-1_1214970?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
},
{
  id: "q87",
  title: "LRU Cache Implementation",
  companies: ["Visa"],
  topics: ["Design", "Hashmap + Doubly Linked List"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Nov 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/lru-cache-implementation_670276?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
},
{
  id: "q88",
  title: "Valid String",
  companies: ["Visa"],
  topics: ["Strings", "Stack"],
  roles: ["SDE-1"],
  roundType: "OA",
  difficulty: "Easy",
  askedDate: "Nov 2020",
  experience: ["College Grad", "0 to 2 Years"],
  solutionLink: "https://www.naukri.com/code360/problems/valid-string_762939?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
},
{
  id: "q89",
  title: "Minimum Cost to Reach End",
  companies: ["Visa"],
  topics: ["Dynamic Programming"],
  roles: ["SDE-1"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad", "0 to 2 Years"],
  solutionLink: "https://www.naukri.com/code360/problems/minimum-cost-to-reach-end_800310?ieSlug=visa-interview-experience-on-campus-dec-2020-1187&ieCompany=visa"
},
{
  id: "q90",
  title: "Max Equal Elements After K Operations",
  companies: ["Visa"],
  topics: ["Arrays", "Greedy"],
  roles: ["SDE-1"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad", "0 to 2 Years"],
  solutionLink: "https://www.naukri.com/code360/problems/maximum-equal-elements-after-k-operations_992848?ieSlug=visa-interview-experience-by-yash-anand-on-campus-dec-2020-285&ieCompany=visa"
},
{
  id: "q91",
  title: "Number of Pairs with Given Sum",
  companies: ["Visa"],
  topics: ["Arrays", "Hashing"],
  roles: ["SDE-1"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Dec 2020",
  experience: ["College Grad", "0 to 2 Years"],
  solutionLink: "https://www.naukri.com/code360/problems/number-of-pairs-with-given-sum_630509?ieSlug=visa-interview-experience-by-yash-anand-on-campus-dec-2020-285&ieCompany=visa"
},
{
  id: "q92",
  title: "Minimum Falling Path Sum",
  companies: ["Visa"],
  topics: ["Dynamic Programming", "Matrix"],
  roles: ["SDE-1"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Sep 2022",
  experience: ["College Grad", "0 to 2 Years"],
  solutionLink: "https://www.naukri.com/code360/problems/minimum-falling-path-sum_893012?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
},

{
  id: "q93",
  title: "Base Conversion",
  companies: ["Uber"],
  topics: ["Math", "Strings"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/minimum-operations-to-make-strings-same_893541?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
},
{
  id: "q94",
  title: "Minimum Operations to Make Strings Same",
  companies: ["Uber"],
  topics: ["Strings", "Dynamic Programming"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/bursting-balloons_701653?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
},
{
  id: "q95",
  title: "Bursting Balloons",
  companies: ["Uber"],
  topics: ["Dynamic Programming"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/word-search_892986?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
},
{
  id: "q96",
  title: "Word Search",
  companies: ["Uber"],
  topics: ["Matrix", "Backtracking"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/lcs-of-3-strings_842499?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
},
{
  id: "q97",
  title: "LCS of 3 Strings",
  companies: ["Uber"],
  topics: ["Strings", "Dynamic Programming"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/distinct-characters_2221410?ieSlug=uber-interview-experience-on-campus-aug-2021-2-7676&ieCompany=uber"
},
{
  id: "q98",
  title: "Distinct Characters",
  companies: ["Uber"],
  topics: ["Strings", "Hashing"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Easy",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/word-search_1095631?ieSlug=uber-interview-experience-on-campus-aug-2021-2-7676&ieCompany=uber"
},
{
  id: "q99",
  title: "Word Search (Variation)",
  companies: ["Uber"],
  topics: ["Matrix", "Backtracking"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Aug 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/lcs-of-3-strings_842499?ieSlug=uber-interview-experience-on-campus-aug-2021-2-7676&ieCompany=uber"
},
{
  id: "q100",
  title: "Meeting Rooms",
  companies: ["Uber"],
  topics: ["Arrays", "Sorting"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/meeting_1376415?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
},
{
  id: "q101",
  title: "Total Unique Paths",
  companies: ["Uber"],
  topics: ["Dynamic Programming"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/total-unique-paths_1081470?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
},
{
  id: "q102",
  title: "Operations to Make Graph Connected",
  companies: ["Uber"],
  topics: ["Graphs", "Union-Find"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/number-of-operations-to-make-graph-connected_1385179?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
},
{
  id: "q103",
  title: "Snake and Ladder",
  companies: ["Uber"],
  topics: ["Graphs", "BFS"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/snake-and-ladder_630458?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
},
{
  id: "q104",
  title: "XOR Query",
  companies: ["Uber"],
  topics: ["Arrays", "Bit Manipulation"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/xor-query_893314?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
},
{
  id: "q105",
  title: "Remove Edges",
  companies: ["Uber"],
  topics: ["Graphs", "Trees"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Hard",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/remove-edges_1264288?ieSlug=uber-interview-experience-on-campus-dec-2020&ieCompany=uber"
},
{
  id: "q106",
  title: "All Prime Numbers",
  companies: ["Uber"],
  topics: ["Math", "Sieve of Eratosthenes"],
  roles: ["SDE-Intern"],
  roundType: "OA",
  difficulty: "Easy",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/all-prime-numbers_624970?ieSlug=uber-interview-experience-on-campus-dec-2020&ieCompany=uber"
},
{
  id: "q107",
  title: "Next Greater Element",
  companies: ["Uber"],
  topics: ["Arrays", "Stack"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/next-greater-element_799354?ieSlug=uber-interview-experience-on-campus-dec-2020&ieCompany=uber"
},
{
  id: "q108",
  title: "Unique BSTs",
  companies: ["Uber"],
  topics: ["Trees", "Dynamic Programming"],
  roles: ["SDE-Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/unique-bsts_3583797?ieSlug=uber-interview-experience-on-campus-dec-2020&ieCompany=uber"
},

{
  id: "q109",
  title: "Search in Rotated Sorted Array",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Binary Search"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/search-in-rotated-sorted-array_630450?ieSlug=goldman-sachs-interview-experience-off-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q110",
  title: "Pair with Difference K",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Hashing"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/pair-with-diff-k_5393?ieSlug=goldman-sachs-interview-experience-off-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q111",
  title: "First Repeated Character",
  companies: ["Goldman Sachs"],
  topics: ["Strings", "Hashing"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/first-repeated-character_1214646?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q112",
  title: "Sliding Window Maximum",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Sliding Window", "Deque"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/sliding-window-maximum_980226?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q113",
  title: "Ways to Make Coin Change",
  companies: ["Goldman Sachs"],
  topics: ["Dynamic Programming"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/ways-to-make-coin-change_630471?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q114",
  title: "0-1 Knapsack",
  companies: ["Goldman Sachs"],
  topics: ["Dynamic Programming"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Oct 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/0-1-knapsack_1072980?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
},
{
  id: "q115",
  title: "Span of Ninja Coin",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Stack"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Mar 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/span-of-ninja-coin_1475049?ieSlug=goldman-sachs-interview-experience-off-campus-mar-2022&ieCompany=goldman-sachs"
},
{
  id: "q116",
  title: "Shortest Path in Unweighted Graph",
  companies: ["Goldman Sachs"],
  topics: ["Graphs", "BFS"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Mar 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/shortest-path-in-an-unweighted-graph_981297?ieSlug=goldman-sachs-interview-experience-off-campus-mar-2022&ieCompany=goldman-sachs"
},
{
  id: "q117",
  title: "Sorted Linked List to Balanced BST",
  companies: ["Goldman Sachs"],
  topics: ["Linked Lists", "Trees"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Mar 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/sorted-linked-list-to-balanced-bst_842564?ieSlug=goldman-sachs-interview-experience-off-campus-mar-2022&ieCompany=goldman-sachs"
},
{
  id: "q118",
  title: "Level Order Traversal",
  companies: ["Goldman Sachs"],
  topics: ["Trees", "BFS"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Easy",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/level-order-traversal_796002?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q119",
  title: "Counting Pairs",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Hashing"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/counting-pairs_980535?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q120",
  title: "Largest Rectangle in Histogram",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Stack"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Hard",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/largest-rectangle-in-a-histogram_1058184?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q121",
  title: "Group Anagrams Together",
  companies: ["Goldman Sachs"],
  topics: ["Strings", "Hashing"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/group-anagrams-together_985354?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q122",
  title: "Longest Palindromic Substring",
  companies: ["Goldman Sachs"],
  topics: ["Strings", "DP"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/longest-palindromic-substring_892999?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q123",
  title: "Merge Overlapping Intervals",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Sorting"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Feb 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/merge-overlapping-intervals_1082151?ieSlug=goldman-sachs-interview-experience-on-campus-feb-2022&ieCompany=goldman-sachs"
},
{
  id: "q124",
  title: "Find All Triplets with Zero Sum",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Two-Pointer"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/find-all-triplets-with-zero-sum_873143?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q125",
  title: "Sort Linked List of 0s, 1s, 2s",
  companies: ["Goldman Sachs"],
  topics: ["Linked Lists"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/sort-linked-list-of-0s-1s-2s_1071937?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q126",
  title: "Implement Trie",
  companies: ["Goldman Sachs"],
  topics: ["Trie", "Design"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/implement-trie_631356?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q127",
  title: "Add Two Numbers as Linked Lists",
  companies: ["Goldman Sachs"],
  topics: ["Linked Lists"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/add-two-numbers-as-linked-lists_1170520?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q128",
  title: "Count Vowels, Consonants, and Spaces",
  companies: ["Goldman Sachs"],
  topics: ["Strings"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/count-vowels-consonants-and-spaces_5026361?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q129",
  title: "Check if String is Palindrome",
  companies: ["Goldman Sachs"],
  topics: ["Strings"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/check-if-the-string-is-a-palindrome_1062633?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q130",
  title: "Reverse Singly Linked List",
  companies: ["Goldman Sachs"],
  topics: ["Linked Lists"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/reverse-the-singly-linked-list_799897?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q131",
  title: "Insertion in AVL Tree",
  companies: ["Goldman Sachs"],
  topics: ["Trees", "AVL"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Jan 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/insertion-in-avl-tree_1263690?ieSlug=goldman-sachs-interview-experience-by-hashini-senthil-on-campus-jan-2022&ieCompany=goldman-sachs"
},
{
  id: "q132",
  title: "Two and Four Wheeler Roads",
  companies: ["Goldman Sachs"],
  topics: ["Graphs", "Union-Find"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/two-and-four-wheeler-roads_699820?ieSlug=interview-experience-on-campus-dec-2021-2-5249&ieCompany=goldman-sachs"
},
{
  id: "q133",
  title: "Best Time to Buy and Sell",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Greedy"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/best-time-to-buy-and-sell_696432?ieSlug=interview-experience-on-campus-dec-2021-2-5249&ieCompany=goldman-sachs"
},
{
  id: "q134",
  title: "Arithmetic Progression Queries",
  companies: ["Goldman Sachs"],
  topics: ["Arrays", "Math"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Dec 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/arithmetic-progression-queries_696448?ieSlug=interview-experience-on-campus-dec-2021-2-5249&ieCompany=goldman-sachs"
},

{
  id: "q135",
  title: "Pascal's Triangle",
  companies: ["ServiceNow"],
  topics: ["Arrays", "Math"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/pascal-s-triangle_1089580?ieSlug=interview-experience-on-campus-may-2022&ieCompany=servicenow"
},
{
  id: "q136",
  title: "Set Matrix Zeros",
  companies: ["ServiceNow"],
  topics: ["Matrix", "Implementation"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/set-matrix-zeros_3846774?ieSlug=interview-experience-on-campus-may-2022&ieCompany=servicenow"
},
{
  id: "q137",
  title: "Find K-th Smallest Element in BST",
  companies: ["ServiceNow"],
  topics: ["Trees", "BST", "Inorder Traversal"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "May 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/find-k-th-smallest-element-in-bst_1069333?ieSlug=interview-experience-on-campus-may-2022&ieCompany=servicenow"
},
{
  id: "q138",
  title: "Pythagorean Triplets",
  companies: ["ServiceNow"],
  topics: ["Hashing", "Math"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "May 2022",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/pythagorean-triplets_797917?ieSlug=interview-experience-on-campus-may-2022&ieCompany=servicenow"
},
{
  id: "q139",
  title: "Pair Sum",
  companies: ["ServiceNow"],
  topics: ["Two Pointers", "Hashing"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/pair-sum_697295?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q140",
  title: "Longest Palindromic Substring",
  companies: ["ServiceNow"],
  topics: ["Strings", "Dynamic Programming"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/longest-palindromic-substring_758900?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q141",
  title: "Is Binary Heap Tree",
  companies: ["ServiceNow"],
  topics: ["Trees", "Heap"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/is-binary-heap-tree_893136?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q142",
  title: "Amusement Park",
  companies: ["ServiceNow"],
  topics: ["Greedy", "Priority Queue"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/amusement-park_1280139?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q143",
  title: "Right View",
  companies: ["ServiceNow"],
  topics: ["Trees", "BFS", "DFS"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/right-view_764605?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q144",
  title: "Implement Trie",
  companies: ["ServiceNow"],
  topics: ["Tries", "Strings"],
  roles: ["SDE"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "Sep 2021",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/implement-trie_631356?ieSlug=interview-experience-on-campus-sep-2021-2-3084&ieCompany=servicenow"
},
{
  id: "q145",
  title: "Isomorphic Trees",
  companies: ["ServiceNow"],
  topics: ["Trees", "Recursion"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/isomorphic-trees_794946?ieSlug=interview-experience-off-campus-dec-2020&ieCompany=servicenow"
},
{
  id: "q146",
  title: "Minimum Number of Increments on Subarrays to Form a Target Array",
  companies: ["ServiceNow"],
  topics: ["Arrays", "Difference Array", "Math"],
  roles: ["SDE"],
  roundType: "OA",
  difficulty: "Medium",
  askedDate: "Dec 2020",
  experience: ["College Grad"],
  solutionLink: "https://www.naukri.com/code360/problems/minimum-number-of-increments-on-subarrays-to-form-a-target-array_1381857?ieSlug=interview-experience-off-campus-dec-2020&ieCompany=servicenow"
}

]

// --- Helper to extract unique values for filters ---
const getUniqueValues = (key: keyof Question, subKey?: keyof Question[keyof Question]) => {
  const values = sampleQuestions.flatMap((q) => {
    const val = q[key]
    if (Array.isArray(val)) {
      return val
    }
    return [val]
  })
  return Array.from(new Set(values.flat())).filter(Boolean) as string[]
}

const allCompanies = getUniqueValues("companies")
const allTopics = getUniqueValues("topics")
const allRoles = getUniqueValues("roles")
const allExperienceLevels = getUniqueValues("experience")
const allRoundTypes: Question["roundType"][] = ["OA", "Technical Interview", "Design", "HR", "Mixed"]
const allDifficulties: Question["difficulty"][] = ["Easy", "Medium", "Hard"]
const allFrequencies: Question["frequency"][] = ["Low", "Medium", "High"]

// --- Company Insights Card Component ---
interface CompanyInsightsCardProps {
  questions: Question[]
  selectedCompany: string | null
  selectedRole: string | null
  selectExperience: string| null
}

function CompanyInsightsCard({ questions, selectedCompany, selectedRole }: CompanyInsightsCardProps) {
  const insights = useMemo(() => {
    if (!selectedCompany || !selectedRole) {
      return null
    }
    const relevantQuestions = questions.filter(
      (q) => q.companies.includes(selectedCompany) && q.roles.includes(selectedRole),
    )
    if (relevantQuestions.length === 0) {
      return { company: selectedCompany, role: selectedRole, distribution: [], totalQuestions: 0 }
    }
    const topicCounts: Record<string, number> = {}
    relevantQuestions.forEach((q) => {
      q.topics.forEach((topic) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1
      })
    })
    const totalTopicOccurrences = Object.values(topicCounts).reduce((sum, count) => sum + count, 0)

    if (totalTopicOccurrences === 0) {
      return {
        company: selectedCompany,
        role: selectedRole,
        distribution: [],
        totalQuestions: relevantQuestions.length,
      }
    }

    const distribution = Object.entries(topicCounts)
      .map(([topic, count]) => ({
        topic,
        percentage: Math.round((count / totalTopicOccurrences) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5) // Show top 5 topics

    return { company: selectedCompany, role: selectedRole, distribution, totalQuestions: relevantQuestions.length }
  }, [questions, selectedCompany, selectedRole])

  if (!insights) {
    return (
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
            <Info className="w-5 h-5" /> Company Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">Select a company and a role to see insights.</p>
        </CardContent>
      </Card>
    )
  }

  if (insights.totalQuestions === 0) {
    return (
      <Card className="bg-yellow-50 border-yellow-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-yellow-700">
            <Info className="w-5 h-5" /> {insights.company} - {insights.role} Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-yellow-600">
            No questions found for this specific company/role combination in the dataset.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-green-50 border-green-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-green-700">
          <BarChart3 className="w-5 h-5" /> {insights.company} - {insights.role} Insights
        </CardTitle>
        <CardDescription className="text-sm text-green-600">
          Based on {insights.totalQuestions} question(s) for this role at {insights.company}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {insights.distribution.length > 0 ? (
          <ul className="space-y-1 text-sm text-green-800">
            {insights.distribution.map((item) => (
              <li key={item.topic} className="flex justify-between">
                <span>{item.topic}</span>
                <span className="font-medium">{item.percentage}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-green-600">Not enough topic data for detailed insights.</p>
        )}
      </CardContent>
    </Card>
  )
}

// --- Main Page Component ---
export default function InterviewPrepPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedRoundType, setSelectedRoundType] = useState<Question["roundType"] | "All">("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Question["difficulty"] | "All">("All")
  const [filterRecency, setFilterRecency] = useState(false) // "Asked in last 6 months"
  const [selectedFrequency, setSelectedFrequency] = useState<Question["frequency"] | "All">("All")
  const [selectedexperience, setSelectedexperience] = useState<string[]>([])

  const filteredQuestions = useMemo(() => {
    const sixMonthsAgo = subMonths(new Date(), 6)
    return sampleQuestions.filter((q) => {
      const matchesSearch = !searchQuery || q.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.some((c) => q.companies.includes(c))
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.some((t) => q.topics.includes(t))
      const matchesRole = selectedRoles.length === 0 || selectedRoles.some((r) => q.roles.includes(r))
      const matchesRoundType = selectedRoundType === "All" || q.roundType === selectedRoundType
      const matchesDifficulty = selectedDifficulty === "All" || q.difficulty === selectedDifficulty
      const matchesRecency = !filterRecency || isAfter(new Date(q.askedDate), sixMonthsAgo)
      const matchesFrequency = selectedFrequency === "All" || q.frequency === selectedFrequency
      const matchesexperience = selectedexperience.length === 0 || selectedexperience.some((exp) => q.experience.includes(exp))
      return (
        matchesSearch &&
        matchesCompany &&
        matchesTopic &&
        matchesRole &&
        matchesRoundType &&
        matchesDifficulty &&
        matchesRecency &&
        matchesFrequency &&
        matchesexperience 
      )
    })
  }, [
    searchQuery,
    selectedCompanies,
    selectedTopics,
    selectedRoles,
    selectedRoundType,
    selectedDifficulty,
    filterRecency,
    selectedFrequency,
    selectedexperience
  ])

  const toggleFilterList = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setter((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  const insightCompany = selectedCompanies.length > 0 ? selectedCompanies[0] : null
  const insightRole = selectedRoles.length > 0 ? selectedRoles[0] : null

  return (
    <div className="bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-sky-600" />
              <h1 className="text-2xl font-bold text-gray-800">PrepMaster</h1>
            </div>
            <Button variant="outline" className="border-sky-500 text-sky-600 hover:bg-sky-50">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6 sticky top-24 self-start">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                  <Search className="w-5 h-5" /> Filter Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Command className="rounded-lg border">
                  <CommandInput
                    placeholder="Search question titles..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                </Command>

                {/* Filters: Company, Topic, Role, Round Type, Difficulty, Frequency, Recency */}
                {/* Company Filter */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1 mb-2 text-gray-600">
                    <Building className="w-4 h-4" /> Companies
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allCompanies.map((company) => (
                      <Button
                        key={company}
                        variant={selectedCompanies.includes(company) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilterList(setSelectedCompanies, company)}
                        className={`w-full justify-start text-xs ${selectedCompanies.includes(company) ? "bg-sky-600 hover:bg-sky-700 text-white" : "hover:bg-sky-50"}`}
                      >
                        {company}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Topic Filter */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1 mb-2 text-gray-600">
                    <Tag className="w-4 h-4" /> Topics
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allTopics.map((topic) => (
                      <Button
                        key={topic}
                        variant={selectedTopics.includes(topic) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilterList(setSelectedTopics, topic)}
                        className={`w-full justify-start text-xs ${selectedTopics.includes(topic) ? "bg-sky-600 hover:bg-sky-700 text-white" : "hover:bg-sky-50"}`}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Role Filter */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1 mb-2 text-gray-600">
                    <Users className="w-4 h-4" /> Roles
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allRoles.map((role) => (
                      <Button
                        key={role}
                        variant={selectedRoles.includes(role) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilterList(setSelectedRoles, role)}
                        className={`w-full justify-start text-xs ${selectedRoles.includes(role) ? "bg-sky-600 hover:bg-sky-700 text-white" : "hover:bg-sky-50"}`}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* experience filter */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-1 mb-2 text-gray-600">
                    <Users className="w-4 h-4" /> Experience
                  </Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {allExperienceLevels.map((experience) => (
                      <Button
                        key={experience}
                        variant={selectedexperience.includes(experience) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFilterList(setSelectedexperience, experience)}
                        className={`w-full justify-start text-xs ${selectedexperience.includes(experience) ? "bg-sky-600 hover:bg-sky-700 text-white" : "hover:bg-sky-50"}`}
                      >
                        {experience}
                      </Button>
                    ))}
                  </div>  
                </div>

                {/* Select Filters */}
                {[
                  {
                    label: "Round Type",
                    Icon: ChevronsUpDown,
                    value: selectedRoundType,
                    setter: setSelectedRoundType,
                    options: ["All", ...allRoundTypes],
                  },
                  {
                    label: "Difficulty",
                    Icon: BarChart3,
                    value: selectedDifficulty,
                    setter: setSelectedDifficulty,
                    options: ["All", ...allDifficulties],
                  },
                  {
                    label: "Frequency",
                    Icon: Zap,
                    value: selectedFrequency,
                    setter: setSelectedFrequency,
                    options: ["All", ...allFrequencies],
                  }
                 
                ].map((filter) => (
                  <div key={filter.label}>
                    <Label
                      htmlFor={`${filter.label}Filter`}
                      className="text-sm font-medium flex items-center gap-1 mb-2 text-gray-600"
                    >
                      <filter.Icon className="w-4 h-4" /> {filter.label}
                    </Label>
                    <Select value={filter.value} onValueChange={(val) => filter.setter(val as any)}>
                      <SelectTrigger id={`${filter.label}Filter`} className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options
                          .filter((opt): opt is string => typeof opt === "string" && !!opt)
                          .map((opt) => (
                            <SelectItem key={opt} value={opt as string} className="text-xs">
                              {opt === "All" ? `All ${filter.label}s` : opt}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="recencyFilter" checked={filterRecency} onCheckedChange={setFilterRecency} />
                  <Label htmlFor="recencyFilter" className="text-sm flex items-center gap-1 text-gray-600">
                    <CalendarDays className="w-4 h-4" /> Asked in last 6 months
                  </Label>
                </div>
              </CardContent>
            </Card>
            <CompanyInsightsCard
              questions={sampleQuestions}
              selectedCompany={insightCompany}
              selectedRole={insightRole}
              selectExperience={selectedexperience[0] || null}
            />
          </div>

          

          <div className="lg:col-span-3 space-y-6">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((question) => (
                <Card
                  key={question.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={question.id} className="border-b-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 text-left group">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-sky-700 group-hover:text-sky-800">
                            {question.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                              {question.difficulty}
                            </Badge>
                            <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                              {question.roundType}
                            </Badge>
                            <Badge className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                              {question.frequency} Freq.
                            </Badge>
                            <Badge className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                              {new Date(question.askedDate).toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric",
                              })}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-200">
                        {question.description && (
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">{question.description}</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Companies
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {question.companies.map((c) => (
                                <Badge key={c} variant="secondary" className="text-xs">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Topics
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {question.topics.map((t) => (
                                <Badge key={t} variant="secondary" className="text-xs">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                              Relevant Roles
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {question.roles.map((r) => (
                                <Badge key={r} variant="secondary" className="text-xs">
                                  {r}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-4">
                          <span className="font-semibold">Asked Date:</span>{" "}
                          {new Date(question.askedDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        {question.solutionLink ? (
                          <Button
                            variant="default"
                            size="sm"
                            asChild
                            className="bg-sky-600 hover:bg-sky-700 text-white"
                          >
                            <a
                              href={question.solutionLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2"
                            >
                              <LinkIcon className="w-4 h-4" /> View Solution
                            </a>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="inline-flex items-center gap-2 text-gray-600 border-gray-300 hover:bg-gray-100"
                            onClick={() =>
                              alert(
                                `Internal details for: ${question.title} (ID: ${question.id}) - Feature to be implemented.`,
                              )
                            }
                          >
                            <FileText className="w-4 h-4" /> View Details
                          </Button>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              ))
            ) : (
              <Card className="text-center py-16 bg-white shadow-lg">
                <CardContent>
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700">No Questions Found</p>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-8 border-t mt-12 bg-white/50">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} PrepMaster. All rights reserved.</p>
      </footer>
    </div>
  )
}
