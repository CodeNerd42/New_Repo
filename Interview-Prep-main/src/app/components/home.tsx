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
  frequency: "High" | "Medium" | "Low"
  experience:string[]// e.g., "0-2 years", "2-5 years", "5+ years" 
  description?: string
  solutionLink?: string // External link
  // If no solutionLink, clicking might eventually go to an internal page /questions/[id]
}

// --- Sample Data (Expand this with your actual data) ---
const sampleQuestions: Question[] = [
  {
    id: "q1",
    title: "Design a Scalable Cache System",
    companies: ["Amazon", "Facebook", "Google"],
    topics: ["System Design", "Scalability", "HLD"],
    roles: ["SDE - 2", "Senior SDE"],
    roundType: "Design",
    difficulty: "Hard",
    askedDate: "2024-05-15T00:00:00.000Z",
    frequency: "High",
    experience: ["2-5 years", "5+ years"],
    description: "Discuss trade-offs for different caching strategies like LRU, LFU, write-through, write-back, etc.",
    solutionLink: "https://example.com/design-cache-solution",
  },
  {
    id: "q2",
    title: "Find Median from Data Stream",
    companies: ["Google", "Microsoft", "Apple"],
    topics: ["Data Structures", "Heaps", "Algorithms"],
    roles: ["SDE - 1", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2025-01-20T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    description: "Efficiently find the median of a stream of numbers. Consider using two heaps.",
  },
  {
    id: "q3",
    title: "Kth Row of Pascal's Triangle",
    companies: ["Google", "Amazon"],
    topics: ["Arrays", "Simulation", "Math"],
    roles: ["SDE - 1", "SDE - Intern"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "2024-11-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description: "Given an index k, return the kth row of Pascal's triangle. Optimize for space.",
    solutionLink: "https://www.interviewbit.com/problems/kth-row-of-pascals-triangle/",
  },
  {
    id: "q4",
    title: "Rotate Matrix",
    companies: ["Google", "Facebook", "Amazon", "Zoho"],
    topics: ["Arrays", "Arrangement", "Matrix"],
    roles: ["SDE - 1", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2025-03-01T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    description: "Rotate an N x N matrix by 90 degrees clockwise in-place.",
  },
  {
    id: "q5",
    title: "Merge Overlapping Intervals",
    companies: ["Google", "Amazon", "Directi", "Fab"],
    topics: ["Arrays", "Value ranges", "Sorting", "Intervals"],
    roles: ["SDE - 1", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2024-08-01T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    solutionLink: "https://www.interviewbit.com/problems/merge-overlapping-intervals/",
  },
  {
    id: "q6",
    title: "N/3 Repeat Number",
    companies: ["Google"],
    topics: ["Arrays", "Missing / Repeated number", "Moore's Voting Algorithm"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2025-02-15T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years", "2-5 years"],
    description: "Find all elements that appear more than N/3 times in an array.",
  },
  {
    id: "q7",
    title: "Grid Unique Paths",
    companies: ["Google", "Amazon", "Microsoft", "Adobe"],
    topics: ["Math", "Combinatorics", "Dynamic Programming"],
    roles: ["SDE - 1", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2024-07-01T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    solutionLink: "https://www.interviewbit.com/problems/grid-unique-paths/",
  },
  {
    id: "q8",
    title: "Median of Array (Sorted Arrays)",
    companies: ["Amazon", "VMWare", "Google", "Microsoft", "Goldman Sachs"],
    topics: ["Binary Search", "Sort modification", "Divide and Conquer", "Arrays"],
    roles: ["SDE - 2", "Senior SDE"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2024-09-20T00:00:00.000Z",
    frequency: "High",
    experience: ["2-5 years", "5+ years"],
    description: "Find the median of two sorted arrays of the same or different sizes.",
  },
  {
    id: "q9",
    title: "Implement Power Function",
    companies: ["Google", "LinkedIn"],
    topics: ["Binary Search", "Search step simulation", "Math"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2024-10-05T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years", "2-5 years"],
    solutionLink: "https://www.interviewbit.com/problems/implement-power-function/",
  },
  {
    id: "q10",
    title: "Arithmetic Expression Evaluation",
    companies: ["Google"],
    topics: ["Array", "Dynamic Programming"],
    roles: ["SDE - Intern", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-06-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years", "2-5 years"],
    description: "Evaluate a given infix arithmetic expression string containing digits and operators (+, -, *, /, parentheses) by implementing proper operator precedence and associativity rules.",
    solutionLink: "https://www.naukri.com/code360/problems/arithmetic-expression-evaluation_1170517?ieSlug=google-interview-experience-by-vinay-kumar-jun-2021-exp-0-2-years&ieCompany=google",
  },

   {
    id: "q11",
    title: "Jump Game",
    companies: ["Google"],
    topics: ["Array", "Dynamic Programming", "Greedy"],
    roles: ["SDE - 1", "SDE - 2"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2024-04-10T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    description: "Determine if you can reach the last index of an array where each element represents your maximum jump length at that position.",
    solutionLink: "https://leetcode.com/problems/jump-game/solution",
  },
   {
  id: "q12",
  title: "Longest Decreasing Subsequence",
  companies: ["Amazon"],
  topics: ["Array", "Dynamic Programming", "Binary Search"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "2020-05-24T00:00:00.000Z",
  frequency: "Medium",
  experience: ["College Grad"],
  description: "You are given an array/list ARR consisting of N integers. Your task is to find the length of the longest decreasing subsequence. A decreasing subsequence is a subsequence in which every element is strictly less than the previous number. Try to solve the problem in O(N log N) time complexity.",
  solutionLink: "https://www.naukri.com/code360/problems/longest-decreasing-subsequence_800300?ieSlug=amazon-interview-experience-by-khushboo-jaisinghani-off-campus-may-2020-190&ieCompany=amazon"
},
{
  id: "q13",
  title: "Convert BST To The Greater Sum Tree",
  companies: ["Amazon"],
  topics: ["Binary Tree", "Binary Search Tree", "Tree", "DFS"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "2020-06-24T00:00:00.000Z",
  frequency: "Medium",
  experience: ["College Grad"],
  description: "You have been given a Binary Search Tree of integers. You are supposed to convert it to a greater sum tree such that the value of every node in the given BST is replaced with the sum of the values of all the nodes which are greater than the value of the current node in the tree. You need to modify the given tree only. You are not allowed to create a new tree.",
  solutionLink: "https://www.naukri.com/code360/problems/convert-bst-to-the-greater-sum-tree_800290?ieSlug=amazon-interview-experience-by-khushboo-jaisinghani-off-campus-may-2020-190&ieCompany=amazon"
},
{
  id: "q14",
  title: "Angle Between Hour Hand And Minute Hand",
  companies: ["Google"],
  topics: ["Math", "Geometry", "Implementation"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2020-05-24T00:00:00.000Z",
  frequency: "Low",
  experience: ["College Grad"],
  description: "Given the time in hours and minutes, you need to calculate the angle between the hour hand and the minute hand. There can be two angles between the hour hand and minute hand, you need to print the minimum of the two. Also, print the floor value of the angle i.e. if the angle is 15.2, you need to print 15.",
  solutionLink: "https://www.naukri.com/code360/problems/angle-between-hour-hand-and-minute-hand_1062726?ieSlug=google-interview-experience-by-vinay-kumar-jun-2021-exp-0-2-years&ieCompany=google"
},

{
  id: "q15",
  title: "Identical Trees",
  companies: ["Microsoft"],
  topics: ["Tree", "Binary Tree", "Recursion"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "2020-08-10T00:00:00.000Z",
  frequency: "Medium",
  experience: ["College Grad"], 
  description: "Check whether two binary trees are identical or not. Initially solved using simple recursion by checking each node and calling left and right subtree. The interviewer asked to explain why full traversal is required for checking identity.",
  solutionLink: "https://www.naukri.com/code360/problems/identical-trees_799364?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},
{
  id: "q16",
  title: "Distinct Subsequences of an Array",
  companies: ["Microsoft"],
  topics: ["Array", "Dynamic Programming", "Hashing"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "2020-08-10T00:00:00.000Z",
  frequency: "Medium",
  experience: ["College Grad"],
  description: "Given an array, count the number of distinct subsequences that can be formed. This involves dynamic programming and maintaining the last seen index of elements to avoid duplicates.",
  solutionLink: "https://www.naukri.com/code360/problems/distinct-subsequences_799558?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},
  {
  id: "q17",
  title: "Delete Kth Node from End of a Linked List",
  companies: ["Microsoft"],
  topics: ["Linked List", "Two Pointers"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Medium",
  askedDate: "2020-09-10T00:00:00.000Z",
  frequency: "High",
  experience: ["College Grad"],
  description: "Given a linked list, delete the kth node from the end. Requires efficient traversal using two pointers to avoid calculating the length explicitly.",
  solutionLink: "https://www.naukri.com/code360/problems/delete-kth-node-from-end-in-linked-list_799912?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},

{
  id: "q18",
  title: "Mean Median Mode of Unsorted Array",
  companies: ["Microsoft"],
  topics: ["Array", "Sorting", "Hashing", "Math"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2020-09-10T00:00:00.000Z", 
  frequency: "Medium",
  experience: ["College Grad"],
  description: "Given an unsorted array, calculate the mean, median, and mode. Mean is computed via sum of elements. Median is found after sorting the array — if the size is odd, return the middle element; if even, return the average of the two middle elements. Mode is calculated using a frequency array and returning the lowest element with maximum frequency.",
  solutionLink: "https://www.naukri.com/code360/problems/mean-median-mode_799894?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},
{
  id: "q19",
  title: "Nth Term of GP Series",
  companies: ["Microsoft"],
  topics: ["Math", "Series", "Precision"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2020-09-10T00:00:00.000Z",
  frequency: "Low",
  experience: ["College Grad"],
  description: "Find the nth term of a geometric progression. Used formula and setprecision method to round off the result to the required format.",
  solutionLink: "https://www.naukri.com/code360/problems/nth-term-of-gp_797999?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},

{
  id: "q20",
  title: "Dice Throw",
  companies: ["Microsoft"],
  topics: ["Dynamic Programming", "Probability", "Combinatorics"],
  roles: ["SDE - Intern"],
  roundType: "Technical Interview",
  difficulty: "Hard",
  askedDate: "2020-09-10T00:00:00.000Z", // Not specified
  frequency: "Medium",
  experience: ["College Grad"],
  description: "Given number of dice and target sum, calculate total number of ways to get the sum using the dice. Used dynamic programming where the number of dice is the row index and the target sum is the column index. Final answer is the last element of the DP table.",
  solutionLink: "https://www.naukri.com/code360/problems/nth-term-of-gp_797999?ieSlug=microsoft-interview-experience-by-rahul-garg-on-campus-aug-2020-194&ieCompany=microsoft"
},

{
    id: "q22",
    title: "Pair Sum",
    companies: ["Uber"],
    topics: ["Array", "Two Pointers", "Hashing"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-01-03T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad", "0-2 years"],
    description:
      "Given an array and a target value, find a pair of elements whose sum equals the target. Can be solved using hashing or two-pointer technique after sorting.",
    solutionLink: "https://www.naukri.com/code360/problems/pair-sum_697295?ieSlug=uber-interview-experience-off-campus-jan-2023&ieCompany=uber"
  },
  {
    id: "q23",
    title: "Merge Two Sorted Linked Lists",
    companies: ["Uber"],
    topics: ["Linked List", "Two Pointers"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-01-03T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad", "0-2 years"],
    description:
      "Merge two sorted linked lists into one sorted list. Use pointer manipulation to iterate and build the new list efficiently.",
    solutionLink: "https://www.naukri.com/code360/problems/merge-two-sorted-linked-lists_800332?ieSlug=uber-interview-experience-off-campus-jan-2023&ieCompany=uber"
  },
  {
    id: "q24",
    title: "Explain Joins and Types of Joins with Examples",
    companies: ["Uber"],
    topics: ["SQL", "DBMS", "Joins"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-01-03T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad", "0-2 years"],
    description:
      "Explain SQL joins (INNER, LEFT, RIGHT, FULL OUTER) with proper syntax and examples. Be prepared to write queries and discuss real-world use cases.",
    solutionLink: "https://www.naukri.com/code360/interview-experiences/uber/uber-interview-experience-off-campus-jan-2023"
  },
  {
    id: "q25",
    title: "Valid Parentheses",
    companies: ["Uber"],
    topics: ["Stack", "String", "Brackets Matching"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-02-07T00:00:00.000Z",
    experience: ["College Grad", "0-2 years"],
    frequency: "High",
    description:
      "Given a string containing brackets (), {}, [], check whether the input string is valid. Use a stack to push open brackets and match them with closing ones.",
    solutionLink: "https://www.naukri.com/code360/problems/valid-parenthesis_795104?ieSlug=uber-interview-experience-off-campus-jan-2023&ieCompany=uber"
  },
  {
    id: "q26",
    title: "Guess the Output - Python List Pop",
    companies: ["Uber"],
    topics: ["Python", "Lists", "Tricky Questions", "Language Specific"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-02-07T00:00:00.000Z",
    experience: ["College Grad", "0-2 years"],
    frequency: "Medium",
    description:
      "Given the code snippet:\na = [1, 2, 3]\nb = a.pop([1, 2])\nprint(a)\nprint(b)\nIdentify and explain the error. Focus on understanding method signatures and Python list operations.",
    solutionLink: "https://www.naukri.com/code360/interview-experiences/uber/uber-interview-experience-off-campus-jan-2023"
  },

  {
    id: "q27",
    title: "Base Conversion",
    companies: ["Uber"],
    topics: ["Math", "Bit Manipulation", "Number Systems"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2021-08-12T00:00:00.000Z",
    experience: ["College Grad"],
    frequency: "Medium",
    description:
      "Convert a number from one base to another. You may need to convert from binary to decimal or any other base. Make sure to handle edge cases.",
    solutionLink: "https://www.naukri.com/code360/problems/base-conversion_1171187?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
  },
  {
    id: "q28",
    title: "Minimum Operations To Make Strings Same",
    companies: ["Uber"],
    topics: ["Strings", "Dynamic Programming"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-08-12T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given two strings, find the minimum number of operations required to make them equal. Commonly solved using DP (Edit Distance-like approach).",
    solutionLink: "https://www.naukri.com/code360/problems/minimum-operations-to-make-strings-same_893541?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
  },
  {
    id: "q29",
    title: "Bursting Balloons",
    companies: ["Uber"],
    topics: ["Dynamic Programming", "Greedy", "Recursion"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-08-12T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given n balloons, where each balloon has a number associated with it, burst the balloons to maximize the number of coins. Use DP with memoization.",
    solutionLink: "https://www.naukri.com/code360/problems/bursting-balloons_701653?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
  },
  {
    id: "q30",
    title: "Word Search - I",
    companies: ["Uber"],
    topics: ["Backtracking", "DFS", "Matrix"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-08-14T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Given an m x n grid of characters and a string, return true if the word exists in the grid. The word can be formed by adjacent letters without reuse.",
    solutionLink: "https://www.naukri.com/code360/problems/word-search_892986?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
  },
  {
    id: "q31",
    title: "LCS of 3 strings",
    companies: ["Uber"],
    topics: ["Dynamic Programming", "Strings"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2021-08-14T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],
    description:
      "Find the length of the longest common subsequence among three given strings. This problem requires 3D Dynamic Programming.",
    solutionLink: "https://www.naukri.com/code360/problems/lcs-of-3-strings_842499?ieSlug=uber-interview-experience-on-campus-aug-2021&ieCompany=uber"
  },
 {
    id: "q32",
    title: "Meeting",
    companies: ["Uber"],
    topics: ["Greedy", "Sorting", "Intervals"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-12-09T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given start and end times of meetings, determine how many meeting rooms are required. Solve using sorting and greedy algorithm.",
    solutionLink: "https://www.naukri.com/code360/problems/meeting_1376415?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
  },
  {
    id: "q33",
    title: "Total Unique Paths",
    companies: ["Uber"],
    topics: ["Dynamic Programming", "Combinatorics", "Recursion"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-12-09T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Find number of unique paths in an m x n grid from top-left to bottom-right, only moving right or down. Use combinatorics or DP.",
    solutionLink: "https://www.naukri.com/code360/problems/total-unique-paths_1081470?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
  },
  {
    id: "q34",
    title: "Number of operations to make Graph connected",
    companies: ["Uber"],
    topics: ["Graph", "DFS", "Union-Find", "Connectivity"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-12-11T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given n nodes and a list of edges, find the minimum number of operations to connect all nodes. Use union-find or DFS.",
    solutionLink: "https://www.naukri.com/code360/problems/number-of-operations-to-make-graph-connected_1385179?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
  },
  {
    id: "q35",
    title: "Snake and Ladder",
    companies: ["Uber", "Visa"],
    topics: ["BFS", "Graphs", "Game Theory"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-12-11T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given a snake and ladder board, find the minimum number of dice throws required to reach the last cell from the first. Use BFS for shortest path.",
    solutionLink: "https://www.naukri.com/code360/problems/snake-and-ladder_630458?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
  },
  {
    id: "q36",
    title: "XOR Query",
    companies: ["Uber"],
    topics: ["Bit Manipulation", "Arrays", "Simulation"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-12-14T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Given a list of two types of queries on an array: insert an element or XOR all elements with a given value, return the final array.",
    solutionLink: "https://www.naukri.com/code360/problems/xor-query_893314?ieSlug=uber-interview-experience-by-on-campus-dec-2020-403&ieCompany=uber"
  },

  {
    id: "q37",
    title: "Remove Edges",
    companies: ["Uber"],
    topics: ["Graph", "Union-Find", "Greedy"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-01-12T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: `Given an undirected graph with N vertices and M edges. Edges are of three types:
      Type 1 edges can only be traversed by person A,
      Type 2 edges by person B,
      Type 3 edges by both A and B.
      Find the maximum number of edges that can be removed such that all nodes remain reachable by both A and B.`,
    solutionLink: "https://www.naukri.com/code360/problems/remove-edges_1264288?ieSlug=uber-interview-experience-by-bhavadharani-on-campus-jan-2023&ieCompany=uber"
  },
  {
    id: "q38",
    title: "GCD Sum",
    companies: ["Uber"],
    topics: ["Math", "Number Theory", "GCD"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2023-01-12T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],
    description: `Find the sum of gcd of all pairs (i, j) such that 1 <= i < j <= N.
      For example, for N=3, pairs are (1,2), (1,3), (2,3).`,
    solutionLink: "https://www.naukri.com/code360/problems/gcd-sum_1472653?ieSlug=uber-interview-experience-by-bhavadharani-on-campus-jan-2023&ieCompany=uber"
  },
  {
    id: "q39",
    title: "Next Greater Element",
    companies: ["Uber"],
    topics: ["Stacks", "Arrays"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-01-12T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years", "2-5 years"],
    description: `Given an array, find the Next Greater Element (NGE) for every element.
      NGE for an element x is the first greater element on the right of x in the array, or -1 if none exists.
      Example: Input [7, 12, 1, 20], Output [12, 20, 20, -1].`,
    solutionLink: "https://www.naukri.com/code360/problems/next-greater-element_670312?ieSlug=uber-interview-experience-by-bhavadharani-on-campus-jan-2023&ieCompany=uber"
  },

  {
    id: "q40",
    title: "Jump Game",
    companies: ["Goldman Sachs"],
    topics: ["Greedy", "Dynamic Programming", "Arrays"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-11T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given array ARR of N integers, return the minimum number of jumps needed to reach the last index. From index i, we can jump to i + k for 1 <= k <= ARR[i]. If it is not possible to reach the end, return -1.",
    solutionLink: "https://www.naukri.com/code360/problems/jump-game_893178?ieSlug=goldman-sachs-interview-experience-oct-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q41",
    title: "Convert Binary Tree to Doubly Linked List",
    companies: ["Goldman Sachs"],
    topics: ["Binary Tree", "Linked List", "Inorder Traversal"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-11T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given a binary tree, convert it to a doubly linked list in-place using inorder traversal. Use left as previous and right as next pointers.",
    solutionLink: "https://www.naukri.com/code360/problems/convert-a-given-binary-tree-to-doubly-linked-list_893106?ieSlug=goldman-sachs-interview-experience-oct-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q42",
    title: "Maximum Sum of Non-Adjacent Nodes",
    companies: ["Goldman Sachs"],
    topics: ["Binary Tree", "Dynamic Programming", "Tree DP"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-11T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Choose a subset of nodes in a binary tree such that no two chosen nodes are directly connected, and the sum is maximized.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-sum-of-nodes-in-a-binary-tree-such-that-no-two-nodes-are-adjacent_1118112?ieSlug=goldman-sachs-interview-experience-oct-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q43",
    title: "Search In The Array",
    companies: ["Goldman Sachs"],
    topics: ["Prefix Sum", "Binary Search", "Arrays"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given an array 'arr' and a set of queries, return the sum of all elements in 'arr' that are less than or equal to each query value.",
    solutionLink: "https://www.naukri.com/code360/problems/search-in-the-array_1116099?ieSlug=goldman-sachs-interview-experience-oct-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  
  {
    id: "q44",
    title: "Reverse a Doubly Linked List",
    companies: ["Goldman Sachs"],
    topics: ["Linked List", "Data Structures"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Reverse a given doubly linked list. Initial approach used stack but caused time complexity issues.",
    solutionLink: "https://www.naukri.com/code360/problems/reverse-a-doubly-linked-list_1116098?ieSlug=goldman-sachs-interview-experience-oct-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q46",
    title: "First Repeated Character in a String",
    companies: ["Goldman Sachs"],
    topics: ["HashMap", "Strings"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-02T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Find the first repeated character in a string. Initially solved with brute force using nested loops, later optimized using HashMap. Time and space complexities were also discussed.",
    solutionLink: "https://www.naukri.com/code360/problems/first-repeated-character_1214646?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
  },
  {
    id: "q47",
    title: "Maximum in Sliding Windows of Size K",
    companies: ["Goldman Sachs"],
    topics: ["Deque", "Sliding Window", "Arrays"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-02T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],
    description:
      "Given an array of integers and a window size K, return the maximum element in each sliding window of size K across the array.",
    solutionLink: "https://www.naukri.com/code360/problems/sliding-window-maximum_980226?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
  },
  {
    id: "q48",
    title: "Coin Change",
    companies: ["Goldman Sachs"],
    topics: ["Dynamic Programming", "Recursion"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-05T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Given coins of denominations D and a value V, return the number of ways to make change for V. Optimized using dynamic programming after explaining the recursive approach.",
    solutionLink: "https://www.naukri.com/code360/problems/ways-to-make-coin-change_630471?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
  },
  {
    id: "q49",
    title: "0 1 Knapsack",
    companies: ["Goldman Sachs","Morgan Stanley"],
    topics: ["Dynamic Programming", "Knapsack", "Greedy"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-05T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Given N items with weights and values and a knapsack with max weight W, return the maximum value that can be carried without breaking any item.",
    solutionLink: "https://www.naukri.com/code360/problems/0-1-knapsack_1072980?ieSlug=goldman-sachs-interview-experience-on-campus-oct-2022&ieCompany=goldman-sachs"
  },
  {
    id: "q50",
    title: "System Design - Design Amazon",
    companies: ["Goldman Sachs"],
    topics: ["System Design", "Scalability", "High-Level Architecture"],
    roles: ["SDE - 1"],
    roundType: "Design",
    difficulty: "Hard",
    askedDate: "2023-07-10T00:00:00.000Z",
    frequency: "Low",
    experience: ["0-2 years"],  
    description:
      "Design Amazon system. The interviewer focused on high-level system design instead of DSA. Tip: Practice system design questions and communicate clearly.",
    solutionLink: "https://www.naukri.com/code360/interview-experiences/goldman-sachs/goldman-sachs-interview-experience-on-campus-oct-2022"
  },
   {
    id: "q51",
    title: "3Sum",
    companies: ["Goldman Sachs"],
    topics: ["Two Pointers", "Sorting"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-03-03T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],    
    description: "Given an array, find all unique triplets that sum to zero. Solved using two pointer approach after sorting the array.",
    solutionLink: "https://www.naukri.com/code360/problems/triplets-with-given-sum_893028?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q52",
    title: "Letter Combinations of a Phone Number",
    companies: ["Goldman Sachs"],
    topics: ["Queue", "Backtracking"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-03-03T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations. Solved using a FIFO Queue approach.",
    solutionLink: "https://www.naukri.com/code360/problems/letter-combinations-of-a-phone-number_983623?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q53",
    title: "N Queens",
    companies: ["Goldman Sachs","Visa"],
    topics: ["Backtracking", "Recursion"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2022-03-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description: "Place N queens on an N×N chessboard so that no two queens attack each other. Solved using recursion and backtracking.",
    solutionLink: "https://www.naukri.com/code360/problems/n-queens_759332?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q54",
    title: "Shortest Palindrome",
    companies: ["Goldman Sachs"],
    topics: ["KMP Algorithm", "String"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-03-17T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Find the shortest palindrome by adding characters in front of a given string. Solved using KMP algorithm.",
    solutionLink: "https://www.naukri.com/code360/problems/shortest-palindrome_3118979?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q55",
    title: "Remove Duplicates from Sorted Array",
    companies: ["Goldman Sachs"],
    topics: ["Two Pointers", "Array"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-03-17T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],
    description: "Remove duplicates in-place from a sorted array and return the length of the modified array.",
    solutionLink: "https://www.naukri.com/code360/problems/remove-duplicates-from-sorted-array_1102307?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  
  {
    id: "q57",
    title: "Set Matrix Zeros",
    companies: ["Goldman Sachs"],
    topics: ["Matrix", "Hashing"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-03-31T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description: "If an element in a matrix is 0, set its entire row and column to 0. Must be done in-place. Solved using HashSet.",
    solutionLink: "https://www.naukri.com/code360/problems/set-matrix-zeros_3846774?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
  {
    id: "q58",
    title: "Word Search I",
    companies: ["Goldman Sachs"],
    topics: ["Backtracking", "Matrix", "DFS"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-03-31T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description: "Search a word in a 2D grid by traversing adjacent cells. Implemented using DFS/backtracking.",
    solutionLink: "https://www.naukri.com/code360/problems/word-search_892986?ieSlug=goldman-sachs-interview-experience-by-roshan-kumar-mar-2022-exp-0-2-years&ieCompany=goldman-sachs"
  },
{
    id: "q59",
    title: "Longest Valid Parentheses",
    companies: ["Intuit"],
    topics: ["Stack", "String", "Dynamic Programming"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description: "Given a string containing just '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
    solutionLink: "https://www.naukri.com/code360/problems/longest-valid-parentheses_1089563?ieSlug=intuit-interview-experience-on-campus-aug-2023&ieCompany=intuit"
  },
  {
    id: "q60",
    title: "Hello World Program Line-by-Line Explanation",
    companies: ["Intuit"],
    topics: ["C++", "Syntax", "Fundamentals"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Explain each line of a basic Hello World program, including header files, main function, and namespaces.",
    solutionLink: ""
  },
  {
    id: "q61",
    title: "Inorder Successor in BST",
    companies: ["Intuit"],
    topics: ["Binary Search Tree", "Tree Traversal"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Given a BST and a node, find the inorder successor of the given node.",
    solutionLink: "https://www.geeksforgeeks.org/inorder-traversal-of-binary-tree/"
  },
  {
    id: "q62",
    title: "Remove K Digits",
    companies: ["Intuit"],
    topics: ["Greedy", "Stack"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Remove k digits from a number represented as a string to get the smallest possible number.",
    solutionLink: "https://www.naukri.com/code360/problems/remove-k-digits_1461221?ieSlug=intuit-interview-experience-on-campus-aug-2023&ieCompany=intuit"
  },
  {
    id: "q63",
    title: "Water Jug Puzzle (3L and 5L, Measure 4L)",
    companies: ["Intuit"],
    topics: ["Simulation", "BFS", "Mathematical"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"], 
    description: "Use two jugs (3L and 5L) to measure exactly 4L of water. Discussed as a puzzle to assess thought process.",
    solutionLink: "https://www.naukri.com/code360/problems/water-jug-problem_1089632?ieSlug=intuit-interview-experience-on-campus-aug-2023&ieCompany=intuit"
  },
  {
    id: "q64",
    title: "Water Jug Problem (Generic X, Y, Z)",
    companies: ["Intuit"],
    topics: ["Simulation", "BFS", "Mathematical"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"], 
    description: "Determine if it's possible to measure exactly Z litres using two jugs of capacities X and Y. Based on classic water jug problem.",
    solutionLink: "https://www.naukri.com/code360/problems/water-jug-problem_1089632?ieSlug=intuit-interview-experience-on-campus-aug-2023&ieCompany=intuit"
  },

  {
    id: "q65",
    title: "Minimum Number of Platforms Needed",
    companies: ["Intuit"],
    topics: ["Greedy", "Sorting", "Intervals"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description: "Given arrival and departure times of trains at a station, find the minimum number of platforms needed so that no train waits.",
    solutionLink: "https://www.naukri.com/code360/problems/minimum-number-of-platform-needed_696322?ieSlug=intuit-interview-experience-by-aniket-sukhija-aug-2022-exp-0-2-years&ieCompany=intuit"
  },
  {
    id: "q66",
    title: "House Robber II",
    companies: ["Intuit"],
    topics: ["Dynamic Programming"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"], 
    description: "Rob houses arranged in a circle. Return the max money that can be robbed without robbing adjacent houses.",
    solutionLink: "https://www.naukri.com/code360/problems/house-robber_839733?ieSlug=intuit-interview-experience-by-aniket-sukhija-aug-2022-exp-0-2-years&ieCompany=intuit"
  },
  {
    id: "q67",
    title: "Maximum Activities",
    companies: ["Intuit"],
    topics: ["Greedy", "Sorting"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description: "Given start and end times of N activities, determine the maximum number of non-overlapping activities a person can perform.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-activities_1062712?ieSlug=intuit-interview-experience-by-aniket-sukhija-aug-2022-exp-0-2-years&ieCompany=intuit"
  },
  {
    id: "q68",
    title: "Construct Binary Tree From Inorder and Level Order Traversals",
    companies: ["Intuit"],
    topics: ["Trees", "Binary Tree Construction", "Recursion"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2023-08-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Construct a binary tree given its inorder and level order traversals. Unique values are assumed.",
    solutionLink: "https://www.naukri.com/code360/problems/construct-binary-tree-from-in-order-and-level-order_2824774?ieSlug=intuit-interview-experience-by-aniket-sukhija-aug-2022-exp-0-2-years&ieCompany=intuit"
  },

   {
    id: "q69",
    title: "Partition Set into Two Subsets with Minimum Difference",
    companies: ["Intuit"],
    topics: ["Dynamic Programming", "Subset Sum"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Hard",
    askedDate: "2021-06-30T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description: "Given an array, partition it into two subsets such that the absolute difference of their sums is minimized.",
    solutionLink: "https://www.naukri.com/code360/problems/partition-a-set-into-two-subsets-such-that-the-difference-of-subset-sums-is-minimum_842494?ieSlug=intuit-interview-experience-by-prerna-singh-on-campus-jun-2021-1823&ieCompany=intuit"
  },
  {
    id: "q70",
    title: "Find Maximum Number Possible by At Most K Swaps",
    companies: ["Intuit"],
    topics: ["Backtracking", "Greedy"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-06-30T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description: "Given digits of a number and an integer K, find the largest number possible by at most K swaps of digits.",
    solutionLink: "https://www.naukri.com/code360/problems/find-maximum-number-possible-by-doing-at-most-k-swaps_1169469?ieSlug=intuit-interview-experience-by-prerna-singh-on-campus-jun-2021-1823&ieCompany=intuit"
  },
  {
    id: "q71",
    title: "Maximum Score with Array Switching",
    companies: ["Intuit"],
    topics: ["Greedy", "Dynamic Programming", "Prefix Sum"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Hard",
    askedDate: "2021-06-30T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Given two sorted arrays, maximize score by picking elements and optionally switching arrays when a common element is found.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-score_2570557?ieSlug=intuit-interview-experience-by-prerna-singh-on-campus-jun-2021-1823&ieCompany=intuit"
  },
  {
    id: "q72",
    title: "Decode String (Longest Palindromic Subsequence)",
    companies: ["Intuit"],
    topics: ["Dynamic Programming", "String"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2021-07-15T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description: "Find the length of the longest palindromic subsequence in a given uppercase string.",
    solutionLink: "https://www.naukri.com/code360/problems/decode-string_1092331?ieSlug=intuit-interview-experience-by-prerna-singh-on-campus-jun-2021-1823&ieCompany=intuit"
  },
  {
    id: "q73",
    title: "Shortest Path in Binary Matrix (with 1s)",
    companies: ["Intuit"],
    topics: ["Graphs", "BFS", "Matrix"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-07-15T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"], 
    description: "Given a binary matrix and source/destination coordinates, return shortest path length consisting only of 1s using 4-directional movement.",
    solutionLink: "https://www.naukri.com/code360/problems/shortest-path-in-a-binary-matrix_699835?ieSlug=intuit-interview-experience-by-prerna-singh-on-campus-jun-2021-1823&ieCompany=intuit"
  },

   {
    id: "q74",
    title: "Count All Subarrays Having Sum Divisible by K",
    companies: ["Intuit"],
    topics: ["Prefix Sum", "Hash Map", "Subarrays"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-01-01T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"], 
    description: "Given an array and an integer K, count the number of subarrays whose sum is divisible by K.",
    solutionLink: "https://www.naukri.com/code360/problems/count-all-sub-arrays-having-sum-divisible-by-k_973254?ieSlug=intuit-interview-experience-on-campus-jan-2021&ieCompany=intuit"
  },
  {
    id: "q75",
    title: "Boolean Evaluation to True",
    companies: ["Intuit"],
    topics: ["Dynamic Programming", "Parenthesis Evaluation"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-01-01T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"], 
    description: "Count the number of ways to parenthesize a boolean expression such that it evaluates to TRUE. Modulo 10^9 + 7.",
    solutionLink: "https://www.naukri.com/code360/problems/problem-name-boolean-evaluation_1214650?ieSlug=intuit-interview-experience-on-campus-jan-2021&ieCompany=intuit"
  },
  {
    id: "q76",
    title: "Minimum Cost to Buy Oranges",
    companies: ["Intuit"],
    topics: ["Dynamic Programming", "Knapsack"],
    roles: ["SDE - Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-01-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"], 
    description: "Given costs for orange packets of varying weights, find the minimum cost to buy exactly W kg using any number of available packets. If not possible, return -1.",
    solutionLink: "https://www.naukri.com/code360/problems/minimum-cost-to-buy-oranges_630455?ieSlug=intuit-interview-experience-on-campus-jan-2021&ieCompany=intuit"
  },
  {
    id: "q77",
    title: "Time to Burn Tree",
    companies: ["Intuit"],
    topics: ["Trees", "Graphs", "BFS"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2021-01-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"], 
    description: "Given a binary tree and a start node, calculate the time taken to burn the entire tree when fire spreads to adjacent nodes every minute.",
    solutionLink: "https://www.naukri.com/code360/problems/time-to-burn-tree_630563?ieSlug=intuit-interview-experience-on-campus-jan-2021&ieCompany=intuit"
  },
  {
    id: "q78",
    title: "Candy Distribution with Constraints",
    companies: ["Intuit"],
    topics: ["Greedy", "Sorting", "Hash Set"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-01-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"], 
    description: "Distribute candies to N friends such that no two friends get the same number of candies, and each friend gets at least A[i]. Minimize total candies. Return -1 if not possible.",
    solutionLink: "https://www.naukri.com/code360/problems/candy-distribution_5038447?ieSlug=intuit-interview-experience-on-campus-jan-2021&ieCompany=intu"
  },

   {
    id: "q79",
    title: "Convert to Hexadecimal",
    companies: ["PayPal"],
    topics: ["Bit Manipulation", "Math", "Number Conversion"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-01-01T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad","0-2 years"],
    description: "Given an integer N, convert it to its equivalent uppercase hexadecimal string. For example, 50 -> '32' and -50 -> 'FFFFFFCE'.",
    solutionLink: "https://www.naukri.com/code360/problems/convert-to-hexadecimal_1102544?ieSlug=paypal-interview-experience-jan-2023-exp-0-2-years&ieCompany=paypal"
  },
  {
    id: "q80",
    title: "Compress the String",
    companies: ["PayPal"],
    topics: ["Strings", "Two Pointers", "Stack"],
    roles: ["Software Engineer"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2023-01-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad","0-2 years"],  
    description: "Given a string, compress it by replacing consecutive repeating characters (more than once) with the character followed by its count. E.g., 'aabcccccaaa' becomes 'a2bc5a3'.",
    solutionLink: "https://www.naukri.com/code360/problems/compress-the-string_893402?ieSlug=paypal-interview-experience-jan-2023-exp-0-2-years&ieCompany=paypal"
  },


   {
    id: "q81",
    title: "Find K Closest Elements",
    companies: ["PayPal"],
    topics: ["Binary Search", "Sorting", "Two Pointers"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-11-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Given a sorted array A, an integer X, and a value K, return the K closest integers to X. If two integers are equally close, return the smaller one. The result should also be sorted.",
    solutionLink: "https://www.naukri.com/code360/problems/find-k-closest-elements_1263702?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },
  {
    id: "q82",
    title: "Search In The Array",
    companies: ["PayPal"],
    topics: ["Prefix Sum", "Binary Search", "Sorting"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-11-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Given an array 'arr' and a query list 'queries', return the sum of all array elements that are less than or equal to each query value.",
    solutionLink: "https://www.naukri.com/code360/problems/search-in-the-array_1116099?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },
  {
    id: "q83",
    title: "Reverse Only Letters",
    companies: ["PayPal"],
    topics: ["Two Pointers", "String Manipulation"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-11-07T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description: "Given a string S, reverse only the letters in it. Non-letter characters remain at their positions. Example: \"a-bC-dEf-ghIj\" becomes \"j-Ih-gfE-dCba\".",
    solutionLink: "https://www.naukri.com/code360/problems/reverse-only-letters_1235236?ieSlug=paypal-interview-experience-on-campus-nov-2022&ieCompany=paypal"
  },

   {
    id: "q84",
    title: "Count Even Odd",
    companies: ["PayPal"],
    topics: ["Hashing", "Frequency Counting"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-10-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],    
    description: `Given an integer array 'ARR', find:
1. Number of elements occurring an odd number of times.
2. Number of elements occurring an even number of times.
Example:
ARR = [2, 1, 2, 1, 5, 5, 2]
Output: 1 2
Explanation:
2 occurs 3 (odd) times,
1 occurs 2 (even) times,
5 occurs 2 (even) times.`,
    solutionLink: "https://www.naukri.com/code360/problems/count-even-odd_757508?ieSlug=paypal-interview-experience-oct-2022-exp-0-2-years&ieCompany=paypal"
  },
  {
    id: "q85",
    title: "SQL Query: Second Highest Salary",
    companies: ["PayPal"],
    topics: ["SQL", "Database"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Write an SQL query to find the second highest salary from the Employee table.",
    solutionLink: ""
  },
  {
    id: "q86",
    title: "Base Conversion",
    companies: ["PayPal"],
    topics: ["Math", "Number Systems"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-11-29T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: `Convert a number to a base-26 system considering '0' in the system,
then convert it to a system without '0'.
Time Complexity: O(log26 n).`,
    solutionLink: "https://www.naukri.com/code360/problems/base-conversion_1171187?ieSlug=paypal-interview-experience-oct-2022-exp-0-2-years&ieCompany=paypal"
  },
  {
    id: "q87",
    title: "Count Ways To Reach The N-th Stairs",
    companies: ["PayPal"],
    topics: ["Dynamic Programming", "Recursion"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-11-29T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: `Count the ways to reach the Nth stair when you can take either 1 or 2 steps.
Relation: dp[i] = dp[i-1] + dp[i-2].`,
    solutionLink: "https://www.naukri.com/code360/problems/count-ways-to-reach-nth-stairs_798650?ieSlug=paypal-interview-experience-oct-2022-exp-0-2-years&ieCompany=paypal"
  },
  {
    id: "q88",
    title: "4 Sum II",
    companies: ["PayPal"],
    topics: ["Sorting", "Two Pointers", "Hashing"],
    roles: ["SDE-1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-11-29T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: `Given four lists, find the number of tuples (i,j,k,l) such that the sum is zero.
Approach:
1) Sort and reduce to 3 sum,
2) Reduce 3 sum to 2 sum,
3) Use two pointers.`,
    solutionLink: "https://www.naukri.com/code360/problems/4-sum-ii_2221639?ieSlug=paypal-interview-experience-oct-2022-exp-0-2-years&ieCompany=paypal"
  },
  {
    id: "q89",
    title: "System Design: Design a Compiler",
    companies: ["PayPal"],
    topics: ["System Design"],
    roles: ["SDE-1"],
    roundType: "Design",
    difficulty: "Hard",
    askedDate: "2022-11-29T00:00:00.000Z",
    frequency: "Low",
    experience: ["0-2 years"],    
    description: `Design a compiler based on your engineering knowledge.
Tips:
- Break down the problem,
- Ask clarifying questions,
- Explain your thought process continuously.`,
    solutionLink: ""
  },

  {
    id: "q91",
    title: "LRU Cache",
    companies: ["Salesforce"],
    topics: ["HashMap", "Linked List", "LRU Cache", "Design"],
    roles: ["Software Engineer AMTS"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2025-02-28T00:00:00.000Z",
    frequency: "High",
    experience: ["3-5 years"],
    description: `Implement an LRU (Least Recently Used) cache. Initially solved with O(n) time complexity, then optimized to O(1) using a HashMap and Doubly Linked List.`,
    solutionLink: "https://leetcode.com/problems/lru-cache/description/"
  },

   {
    id: "q92",
    title: "Break The Prison",
    companies: ["Salesforce"],
    topics: ["Graphs", "BFS", "DFS", "Matrix Traversal"],
    roles: ["Member of Technical Staff (MTS)"],
    roundType: "Technical Interview", 
    difficulty: "Medium",
    askedDate: "2023-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "A matrix-based traversal problem where you need to find the path or minimum operations to break out of a prison-like grid. Exact constraints and conditions are not specified, but this typically involves BFS/DFS.",
    solutionLink: "https://www.naukri.com/code360/problems/break-the-prison_1755915?ieSlug=salesforce-interview-experience-oct-2023-exp-0-2-years&ieCompany=salesforce"
  },
  {
    id: "q93",
    title: "Low-Level Design - Parking Lot System",
    companies: ["Salesforce"],
    topics: ["OOP", "Design Patterns", "System Design", "UML"],
    roles: ["Member of Technical Staff (MTS)"],
    roundType: "Design",
    difficulty: "Medium",
    askedDate: "2023-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Design a parking lot system with low-level details. Discuss classes, relationships, and functions. Clarify expectations with the interviewer regarding scope: class diagram, code skeleton, or runnable code.",
    solutionLink: ""
  },
  {
    id: "q94",
    title: "High-Level Design - MakeMyTrip",
    companies: ["Salesforce"],
    topics: ["System Design", "Scalability", "Microservices", "Database Design"],
    roles: ["Member of Technical Staff (MTS)"],
    roundType: "Design",
    difficulty: "Medium",
    askedDate: "2023-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Design the system architecture for a platform like MakeMyTrip. Includes behavioral assessment by Hiring Manager. Focus on gathering requirements, driving the discussion, and not using buzzwords without understanding.",
    solutionLink: ""
  },

   {
    id: "q95",
    title: "Pair Sum",
    companies: ["Salesforce"],
    topics: ["Two Pointers", "Sorting", "Hashing"],
    roles: ["Member of Technical Staff 1 (MTS-1)"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-07-16T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Given an array 'ARR' and an integer 'S', return all unique pairs (i,j) such that arr[i] + arr[j] = S. Each pair should be sorted, and final list should be sorted by the first and second elements respectively.",
    solutionLink: ""
  },
  {
    id: "q96",
    title: "Word Search - I",
    companies: ["Salesforce"],
    topics: ["DFS", "Matrix", "Backtracking"],
    roles: ["Member of Technical Staff 1 (MTS-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-07-16T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Given a 2D board and a word, determine if the word exists in the grid. The word can be formed from adjacent (horizontally or vertically) characters and no cell can be reused.",
    solutionLink: ""
  },
  {
    id: "q97",
    title: "Design Ticket Booking System",
    companies: ["Salesforce"],
    topics: ["Low-Level Design", "OOP", "Concurrency"],
    roles: ["Member of Technical Staff 1 (MTS-1)"],
    roundType: "Design",
    difficulty: "Medium",
    askedDate: "2022-07-16T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description: "Design a ticket booking system similar to BookMyShow. Discuss components like seat reservation, holding mechanism, concurrency issues, and design clarity. Emphasis on handling edge cases and engaging the interviewer with clarifying questions.",
    solutionLink: ""
  },

  {
    id: "q98",
    title: "Maximum Sum of Non-Adjacent Elements",
    companies: ["Salesforce"],
    topics: ["Dynamic Programming", "Subsequence"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-06-02T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Given an array of integers, return the maximum sum of the subsequence such that no two elements are adjacent. A subsequence is formed by deleting zero or more elements, without changing the order.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-sum-of-non-adjacent-elements_843261?ieSlug=salesforce-interview-experience-off-campus-jun-2022&ieCompany=salesforce"
  },
  {
    id: "q99",
    title: "Minimum Cost to Hire M Candidates",
    companies: ["Salesforce"],
    topics: ["Greedy", "Sorting", "Mathematics"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2022-06-02T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Given skill and expected salary of N candidates, find the minimum cost to hire M candidates such that salary is proportional to skill and salary expectations are met. Return the minimum possible total salary.",
    solutionLink: "https://www.naukri.com/code360/problems/minimum-cost-to-hire-m-candidates_1387106?ieSlug=salesforce-interview-experience-off-campus-jun-2022&ieCompany=salesforce"
  },
  {
    id: "q100",
    title: "System Design: Search Typeahead",
    companies: ["Salesforce"],
    topics: ["System Design", "Trie", "Autocomplete"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Design",
    difficulty: "Medium",
    askedDate: "2022-06-16T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Design a search typeahead system that suggests possible queries as the user types. Emphasis on data structures like Trie and considerations like ranking, caching, and performance optimization.",
    solutionLink: ""
  },
  {
    id: "q101",
    title: "Maximum Sum Of (i * ARR[i]) Among All Rotations",
    companies: ["Salesforce"],
    topics: ["Math", "Prefix Sum", "Array"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-06-16T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Given an array, calculate the maximum value of sum(i * arr[i]) among all possible rotations. Rotations can be left or right, any number of times. Efficient approach required.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-sum-of-i-arr-i-among-all-possible-rotations-of-an-array_893272?ieSlug=salesforce-interview-experience-off-campus-jun-2022&ieCompany=salesforce"
  },

  {
    id: "q102",
    title: "Ninja And The Dance Competition",
    companies: ["Visa"],
    topics: ["Hashing", "Pairs", "Set"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-11-03T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"], 
    description:
      "Given an array and a number K, return the count of distinct pairs with absolute difference equal to K. Duplicate values in the array should be handled properly, and each pair must be counted only once.",
    solutionLink: "https://www.naukri.com/code360/problems/ninja-and-the-dance-competetion_1172167?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
  },
  {
    id: "q103",
    title: "Maximum Length Sub-array with Adjacent Difference 0 or 1",
    companies: ["Visa"],
    topics: ["Array", "Two Pointers", "Sliding Window"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-11-03T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Given an array of integers, find the maximum length of the sub-array where the absolute difference between every two adjacent elements is either 0 or 1.",
    solutionLink: "https://www.naukri.com/code360/problems/maximum-length-sub-array-having-absolute-difference-of-adjacent-elements-either-0-or-1_1214970?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
  },
  {
    id: "q104",
    title: "LRU Cache Implementation",
    companies: ["Visa"],
    topics: ["HashMap", "Doubly Linked List", "Design"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-11-04T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Design a data structure for LRU (Least Recently Used) cache with get and put operations. Ensure both operations are done in O(1) time.",
    solutionLink: "https://www.naukri.com/code360/problems/lru-cache-implementation_670276?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
  },
  {
    id: "q105",
    title: "Valid String",
    companies: ["Visa"],
    topics: ["Stack", "Greedy", "String"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-11-04T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given a string containing '(', ')' and '*', determine if it can be a valid parenthesis expression. '*' can be treated as '(', ')' or empty.",
    solutionLink: "https://www.naukri.com/code360/problems/valid-string_762939?ieSlug=visa-interview-experience-by-on-campus-nov-2020-505&ieCompany=visa"
  },

  {
    id: "q106",
    title: "Minimum Falling Path Sum",
    companies: ["Visa"],
    topics: ["Dynamic Programming", "2D Array"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2022-09-23",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Given a square matrix of integers, find the minimum sum of a falling path starting from any element in the first row and ending in any element in the last row, where the next row's element must be from the same column or adjacent columns.",
    solutionLink: "https://www.naukri.com/code360/problems/minimum-falling-path-sum_893012?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
  },
  {
    id: "q107",
    title: "Longest Increasing Subsequence",
    companies: ["Visa","American Express"],
    topics: ["Dynamic Programming", "Binary Search"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2022-09-23",
    frequency: "Medium",
    experience: ["0-2 years"],  
    description:
      "Given an array, find the length of the longest subsequence such that all elements are strictly increasing.",
    solutionLink: "https://www.naukri.com/code360/problems/longest-increasing-subsequence_630459?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
  },
  {
    id: "q108",
    title: "Colourful Balls",
    companies: ["Visa","American Express"],
    topics: ["Sliding Window", "Hashing", "Greedy"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2022-09-23",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given N balls with colors, find the maximum number of distinct colors in any K consecutive balls with at most one repaint operation allowed.",
    solutionLink: "https://www.naukri.com/code360/problems/colourful-balls_4518936?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
  },
  {
    id: "q109",
    title: "Max GCD Pair",
    companies: ["Visa"],
    topics: ["Mathematics", "Brute Force", "GCD"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-09-29",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given an array of integers, find the maximum GCD among all pairs in the array.",
    solutionLink: "https://www.naukri.com/code360/problems/max-gcd-pair_842786?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
  },
  {
    id: "q110",
    title: "Sum of Big Integers",
    companies: ["Visa"],
    topics: ["String", "Math", "Big Numbers"],
    roles: ["Software Development Engineer 1 (SDE-1)"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-09-30",
    frequency: "Low",
    experience: ["0-2 years"],  
    description:
      "You are given two very large numbers in string format. Your task is to compute their sum and return the result as a string.",
    solutionLink: "https://www.naukri.com/code360/problems/sum-of-big-integers_1229068?ieSlug=visa-interview-experience-by-426-aman-gupta-t15-on-campus-sep-2022&ieCompany=visa"
  },

  {
    id: "q112",
    title: "Longest Common Subsequence",
    companies: ["Visa"],
    topics: ["Dynamic Programming", "String"],
    roles: ["Fullstack Developer Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-08-24",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given two strings, find the length of the longest subsequence present in both of them. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.",
    solutionLink: "https://www.naukri.com/code360/problems/longest-common-subsequence_1063255?ieSlug=visa-interview-experience-by-on-campus-aug-2021-1131&ieCompany=visa"
  },
  {
    id: "q113",
    title: "Graph Connectivity Queries",
    companies: ["Visa"],
    topics: ["Graph", "DFS", "Union Find", "Disjoint Set"],
    roles: ["Fullstack Developer Intern"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-08-24",
    frequency: "Medium",
    experience: ["College Grad"], 
    description:
      "Answer queries to check if two nodes in a graph are connected or not. You may be required to update connections dynamically or pre-process the graph for multiple queries.",
    solutionLink: "https://www.naukri.com/code360/problems/graph-connectivity-queries_1384006?ieSlug=visa-interview-experience-by-on-campus-aug-2021-1131&ieCompany=visa"
  },

  {
  id: "q114",
  title: "Second Most Repeated Word",
  companies: ["Visa"],
  topics: ["Array", "HashMap", "String"],
  roles: ["Fullstack Developer Intern"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2021-08-31",
  frequency: "Medium",
  experience: ["College Grad"], 
  description:
    "You are given an array of strings ‘ARR’. You have to find out the second most repeated word in the array ‘ARR’. It is guaranteed every string occurs a unique number of times in the array. If there is only one unique string in the array, return an empty string. Example: S = [‘aaa’, ‘bbb’, ‘ccc’, ‘aaa’, ‘bbb’, ‘aaa’] → The answer is ‘bbb’ as it is repeated 2 times and is the second most repeated word in the array.",
  solutionLink: "https://www.naukri.com/code360/problems/second-most-repeated-word_3210218?ieSlug=visa-interview-experience-by-on-campus-aug-2021-1131&ieCompany=visa"
},

 {
    id: "q115",
    title: "Word Break",
    companies: ["American Express"],
    topics: ["Dynamic Programming", "Strings", "Recursion", "Memoization"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2020-09-10T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],
    description:
      "You are given a list of 'N' strings A. Your task is to check whether you can form a given target string using a combination of one or more strings of A. You can use any string of A multiple times.\n\nExample:\nA = ['coding', 'ninjas', 'is', 'awesome'], target = 'codingninjas'\nOutput: true"
    , solutionLink:"https://www.naukri.com/code360/problems/word-break_1094901?ieSlug=american-express-interview-experience-sep-2020-exp-0-2-years&ieCompany=american-express"
  },
  {
    id: "q116",
    title: "All Paths From Source Lead To Destination",
    companies: ["American Express"],
    topics: ["Graph", "DFS", "Cycle Detection"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2020-09-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "Given a directed graph and two nodes SRC and DEST, determine whether all paths starting from SRC eventually lead to DEST, meeting the following:\n1. At least one path exists from SRC to DEST.\n2. If there exists a path from SRC to a node with no outgoing edges, it must be DEST.\n3. There are a finite number of paths from SRC to DEST.",
      solutionLink:"https://www.naukri.com/code360/problems/all-paths-from-source-lead-to-destination_1376425?ieSlug=american-express-interview-experience-sep-2020-exp-0-2-years&ieCompany=american-express"
  },
  {
    id: "q117",
    title: "Maximum Sum of Non-Adjacent Elements",
    companies: ["American Express"],
    topics: ["Dynamic Programming", "Array"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2021-09-13T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Given an array of integers, return the maximum sum of the subsequence such that no two elements are adjacent.\nNote: A subsequence is obtained by deleting some (or no) elements without changing the order.",
      solutionLink:"https://www.naukri.com/code360/problems/maximum-sum-of-non-adjacent-elements_843261?ieSlug=american-express-interview-experience-sep-2020-exp-0-2-years&ieCompany=american-express"
  },
  {
    id: "q118",
    title: "Find All Anagrams",
    companies: ["American Express"],
    topics: ["Sliding Window", "HashMap", "String"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2021-09-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "You are given two strings STR and PTR. Find all starting indices of PTR’s anagram in STR.\nReturn indices in increasing order.\n\nExample:\nSTR = 'BACDGABCDA', PTR = 'ABCD' → Output: [0, 5, 6]",
      solutionLink:"https://www.naukri.com/code360/problems/find-all-anagrams_975387?ieSlug=american-express-interview-experience-sep-2020-exp-0-2-years&ieCompany=american-express"
  },
  {
    id: "q119",
    title: "SQL Query to Find Second Highest Salary",
    companies: ["American Express"],
    topics: ["SQL", "Database"],
    roles: ["SDE - 1"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2021-09-14T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],  
    description:
      "Write a SQL query to find the second highest salary from the Employee table without using TOP or LIMIT keywords.",
      solutionLink:""
  },
  {
    id: "q122",
    title: "Reverse Words In A String",
    companies: ["American Express"],
    topics: ["Strings", "Two Pointers"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "2021-08-20T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],
    description:
      "You are given a string 'str' of length 'N'. Your task is to reverse the original string word by word. There can be multiple spaces between two words and there can be leading or trailing spaces, but in the output reversed string you need to put a single space between two words, and your reversed string should not contain leading or trailing spaces.\n\nExample:\nInput: \"  Welcome to   Coding Ninjas  \"\nOutput: \"Ninjas Coding to Welcome\""
    ,  solutionLink:"https://www.naukri.com/code360/problems/reverse-words_696444?ieSlug=american-express-interview-experience-on-campus-aug-2021-2110&ieCompany=american-express"
    },
  {
    id: "q123",
    title: "Maximum In Sliding Windows Of Size K",
    companies: ["American Express"],
    topics: ["Deque", "Sliding Window", "Monotonic Queue", "Heap"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Medium",
    askedDate: "2021-08-20T00:00:00.000Z",
    frequency: "High",
    experience: ["0-2 years"],
    description:
      "Given an array/list of integers of length ‘N’, there is a sliding window of size ‘K’ which moves from the beginning of the array to the end. You are to return the maximum element in each of the 'N-K+1' windows.",
      solutionLink:"https://www.naukri.com/code360/problems/sliding-window-maximum_980226?ieSlug=american-express-interview-experience-on-campus-aug-2021-2110&ieCompany=american-express"
  },
  {
    id: "q124",
    title: "Find Value Whose XOR With X Is Maximum",
    companies: ["American Express"],
    topics: ["Bit Manipulation", "Greedy"],
    roles: ["SDE - 1"],
    roundType: "OA",
    difficulty: "Easy",
    askedDate: "2021-08-20T00:00:00.000Z",
    frequency: "Medium",
    experience: ["0-2 years"],
    description:
      "You are given an integer 'X'. Find an integer 'Y' (0 ≤ Y ≤ (2^61 - 1)) such that the bitwise XOR of X and Y is maximized. Return this maximum value.\n\nNote:\n1. The maximum value must be storable in a 64-bit integer.\n2. 'X' is always non-negative.",
      solutionLink:"https://www.naukri.com/code360/problems/find-a-value-whose-xor-with-a-given-value-is-maximum_893020?ieSlug=american-express-interview-experience-on-campus-aug-2021-2110&ieCompany=american-express"
  },

{
  id: "q125",
  title: "All Unique Permutations",
  companies: ["American Express"],
  topics: ["Backtracking", "Recursion", "Hashing"],
  roles: ["SDE - 1"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2021-02-01T00:00:00.000Z",
  frequency: "Medium",
  experience: ["0-2 years"],  
  description:
    "You are given an array Arr consisting of N integers. Your task is to find all the unique permutations of the given array.\n\nExample:\nInput: [1, 1, 2]\nOutput: [[1,1,2],[1,2,1],[2,1,1]]\n\nNotes:\n1. There might be duplicates present in the array.\n2. The order of permutations in the output does not matter.\n3. Do not use any in-built library functions to generate permutations.",
  solutionLink: "https://www.naukri.com/code360/problems/all-unique-permutations_1094902?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express" // Replace with preferred solution source
},

{
  id: "q126",
  title: "Min Jumps",
  companies: ["American Express"],
  topics: ["Dynamic Programming", "Graphs", "Greedy", "2D Grid"],
  roles: ["SDE - 1"],
  roundType: "Technical Interview",
  difficulty: "Easy",
  askedDate: "2021-02-09T00:00:00.000Z",
  frequency: "Medium",
  experience: ["0-2 years"],
  description: `You live in a Ninja town which is in the form of an N * M grid. In this town, people travel by jumping over buildings present in each cell of the grid. Santa starts at (0,0) and wants to reach the cell (N-1, M-1) with minimum time.

The movement is allowed:
- Right: (x, y+1)
- Down: (x+1, y)
- Diagonal Down-Right: (x+1, y+1)

Time taken = absolute difference between heights of source and destination buildings.

Constraints:
1. Heights of buildings are positive.
2. Santa cannot go outside the grid.
3. Goal: Minimize the total time taken.`,
  solutionLink: "https://www.naukri.com/code360/problems/min-jumps_985273?ieSlug=american-express-interview-experience-on-campus-feb-2021&ieCompany=american-express"
},

{
    id: "q127",
    title: "Missing Vertex In Parallelogram",
    companies: ["Morgan Stanley"],
    topics: ["Geometry", "Vectors"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2018-08-01T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Given 3 points of a parallelogram, find the 4th such that opposite vertices sum to same vector.\n\nApproach:\nLet A and C be diagonal ends, and B be one vertex. Then D = A + C - B.",
    solutionLink: "https://www.naukri.com/code360/problems/missing-vertex-in-parallelogram_1234567https://www.naukri.com/code360/problems/missing-vertex-in-parallelogram_992854?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q128",
    title: "Vertex Cover Problem",
    companies: ["Morgan Stanley"],
    topics: ["Graphs", "Greedy", "DSA"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2018-08-01T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given an undirected graph with N nodes and M edges, return the size of the minimum vertex cover.\n\nApproach:\nTry all subsets or use greedy approximation if NP-Hard exact solution not required. Or reduce to bipartite matching for special cases.",
    solutionLink: "https://www.naukri.com/code360/problems/vertex-cover_1234568https://www.naukri.com/code360/problems/vertex-cover-problem_1081481?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  
  {
    id: "q130",
    title: "Travelling Salesman Problem",
    companies: ["Morgan Stanley"],
    topics: ["Graphs", "DP", "Bitmasking"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],   
    description:
      "Find shortest tour visiting all cities exactly once and returning to start.\n\nApproach:\nUse DP with bitmasking: DP[mask][i] = min cost to visit all cities in 'mask' ending at city i.",
    solutionLink: "https://www.naukri.com/code360/problems/travelling-salesman-problem_1385180?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q131",
    title: "Convert Number to Words",
    companies: ["Morgan Stanley"],
    topics: ["String", "Recursion", "Implementation"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Convert an integer N to its word representation.\n\nExample: 2234 -> two thousand two hundred and thirty four\n\nApproach:\nUse map of number words and process number in chunks (hundreds, tens, units).",
    solutionLink: "https://www.naukri.com/code360/problems/convert-number-to-words_1093217?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q132",
    title: "Min Stack",
    companies: ["Morgan Stanley"],
    topics: ["Stack", "Design", "DSA"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Design a stack supporting push, pop, top, and getMin in O(1).\n\nApproach:\nMaintain a second stack to store min values.",
    solutionLink: "https://www.naukri.com/code360/problems/min-stack_3843991?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q133",
    title: "Celebrity Problem",
    companies: ["Morgan Stanley"],
    topics: ["Graphs", "Matrix", "Greedy"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given N people and a knows(A, B) function, find the celebrity who is known by all and knows none.\n\nApproach:\nUse two pointer elimination method or stack to find candidate, then verify.",
    solutionLink: "https://www.naukri.com/code360/problems/the-celebrity-problem_982769?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q134",
    title: "Populating Next Right Pointers In Each Node",
    companies: ["Morgan Stanley"],
    topics: ["Trees", "BFS", "Pointers"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],
    description:
      "Given a complete binary tree, set each node's next pointer to the node on its right.\n\nApproach:\nUse level order traversal and connect nodes.",
    solutionLink: "https://www.naukri.com/code360/problems/next-right-pointer_1234574https://www.naukri.com/code360/problems/populating-next-right-pointers-in-each-node_1263696?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q135",
    title: "Search In A Row and Column Wise Sorted Matrix",
    companies: ["Morgan Stanley"],
    topics: ["Matrix", "Binary Search"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2018-08-05T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    description:
      "Find the position of a target in a matrix sorted row and column wise.\n\nApproach:\nStart from top right or bottom left and eliminate rows/cols accordingly.",
    solutionLink: "https://www.naukri.com/code360/problems/search-in-a-row-wise-and-column-wise-sorted-matrix_839811?ieSlug=morgan-stanley-interview-experience-by-aayush-jham-aug-2018-exp-0-2-years&ieCompany=morgan-stanley"
  },

  {
    id: "q136",
    title: "Longest Substring with At Most K Distinct Characters",
    companies: ["Morgan Stanley"],
    topics: ["Sliding Window", "Hashing", "Two Pointers"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-11-10T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/longest-sub-string-with-at-most-k-distinct-characters_699944?ieSlug=morgan-stanley-interview-experience-by-bhupendra-off-campus-nov-2020-765&ieCompany=morgan-stanley"
  },
  {
    id: "q137",
    title: "Find Duplicate",
    companies: ["Morgan Stanley"],
    topics: ["Arrays", "Hashing", "Math"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-11-10T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/find-duplicate_625160?ieSlug=morgan-stanley-interview-experience-may-2020-exp-0-2-years&ieCompany=morgan-stanley"
  },
  {
    id: "q138",
    title: "Ninja and Binary String",
    companies: ["Morgan Stanley"],
    topics: ["Greedy", "Binary String", "String"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-11-05T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/ninja-and-binary-string_1558387?ieSlug=morgan-stanley-interview-experience-by-bhupendra-off-campus-nov-2020-765&ieCompany=morgan-stanley"
  },
  {
    id: "q139",
    title: "Split the String",
    companies: ["Morgan Stanley"],
    topics: ["String", "Substring"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2020-11-05T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/split-the-string_1558384?ieSlug=morgan-stanley-interview-experience-by-bhupendra-off-campus-nov-2020-765&ieCompany=morgan-stanley"
  },
  {
    id: "q140",
    title: "Sort Characters by Frequency",
    companies: ["Morgan Stanley"],
    topics: ["Hash Map", "Sorting", "Greedy"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2020-11-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/sorting-characters-by-frequency_1263699"
  },

    {
    id: "q141",
    title: "Minimum Sum of Absolute Differences",
    companies: ["Adobe"],
    topics: ["Greedy", "Sorting", "Arrays"],
    roles: ["Product Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-08T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/minimum-sum-of-absolute-difference_973294?ieSlug=adobe-interview-experience-on-campus-aug-2023-8779&ieCompany=adobe"
  },
  {
    id: "q142",
    title: "Search In A 2D Matrix",
    companies: ["Adobe"],
    topics: ["Matrix", "Binary Search"],
    roles: ["Product Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-08T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/search-in-a-2d-matrix_980531?ieSlug=adobe-interview-experience-on-campus-aug-2023-8779&ieCompany=adobe"
  },
  {
    id: "q143",
    title: "Spiral Matrix",
    companies: ["Adobe"],
    topics: ["Matrix", "Simulation"],
    roles: ["Product Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2023-08-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/spiral-matrix_840698?ieSlug=adobe-interview-experience-on-campus-aug-2023-8779&ieCompany=adobe"
  },
  {
    id: "q144",
    title: "Save Ninja Land",
    companies: ["Adobe"],
    topics: ["BFS", "Graph", "Simulation"],
    roles: ["Product Intern"],
    roundType: "Technical Interview",
    difficulty: "Hard",
    askedDate: "2023-08-10T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    solutionLink: "https://www.naukri.com/code360/problems/save-ninja-land_2826683?ieSlug=adobe-interview-experience-on-campus-aug-2023-8779&ieCompany=adobe"
  },
   {
    id: "q148",
    title: "System Design: BookMyShow",
    companies: ["Adobe"],
    topics: ["System Design"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Medium",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "Low",
    experience: ["College Grad"],
    description: "Design a scalable online movie ticketing system like BookMyShow. It should allow users to browse movies, check seat availability, and book tickets. Consider database schema design, microservices, load balancing, concurrency, and fault tolerance.",
    solutionLink: ""
  },
  {
    id: "q149",
    title: "Check Permutation",
    companies: ["Adobe"],
    topics: ["Hashing", "Strings"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "High",
    experience: ["College Grad"],
     description: "Given two strings, check if one is a permutation of the other. Two strings are permutations if they contain the same characters in any order. Use hashing or sorting to verify character counts.",
    solutionLink: "https://www.naukri.com/code360/problems/check-permutation_624575?ieSlug=adobe-interview-experience-by-shivam-off-campus-oct-2022&ieCompany=adobe"
  },
  {
    id: "q150",
    title: "Find Peak Element",
    companies: ["Adobe"],
    topics: ["Binary Search", "Arrays"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given an array, find a peak element where the element is greater than or equal to its neighbors. A peak element is an element that is not smaller than its neighbors.",
    solutionLink: "https://www.naukri.com/code360/problems/find-peak-element_1081482?ieSlug=adobe-interview-experience-by-shivam-off-campus-oct-2022&ieCompany=adobe"
  },
  {
    id: "q151",
    title: "Diameter of Binary Tree",
    companies: ["Adobe"],
    topics: ["Trees", "DFS", "Recursion"],
    roles: ["SDE - Intern"],
    roundType: "Technical Interview",
    difficulty: "Easy",
    askedDate: "2022-10-13T00:00:00.000Z",
    frequency: "Medium",
    experience: ["College Grad"],
    description:
      "Given a binary tree, find the diameter of the tree. The diameter is defined as the length of the longest path between any two nodes in the tree.",
    solutionLink: "https://www.naukri.com/code360/problems/diameter-of-the-binary-tree_920552?ieSlug=adobe-interview-experience-by-shivam-off-campus-oct-2022&ieCompany=adobe"
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
                    <Users className="w-4 h-4" /> experience
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
                        {filter.options.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-xs">
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
