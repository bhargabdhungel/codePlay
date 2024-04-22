import Layout from "../../components/Layout";
import Separator from "../../components/Separator";
import { Direction } from "../../assets/types";

export default function Problem() {
  return (
    <Layout>
      <div className="flex w-full h-full">
        <div className="w-1/3 h-full overflow-y-scroll p-2 text-xl">
          <h1 className="text-2xl font-bold mb-4">Problem</h1>
          <h2 className="text-lg font-bold mb-2">Problem Statement</h2>
          <p className="mb-4">
            Given a string s, find the length of the longest substring without
            repeating characters.
          </p>
          <h2 className="text-lg font-bold mb-2">Description</h2>
          <p className="mb-4">
            A substring is a contiguous sequence of characters within a string.
          </p>

          <p className="mb-2">Example 1:</p>
          <p className="mb-4">
            Input: s = "abcabcbb" Output: 3 Explanation: The answer is "abc",
            with the length of 3.
          </p>
          <p className="mb-2">Example 2:</p>
          <p className="mb-4">
            Input: s = "bbbbb" Output: 1 Explanation: The answer is "b", with
            the length of 1.
          </p>
          <p className="mb-2">Example 3:</p>
          <p className="mb-4">
            Input: s = "pwwkew" Output: 3 Explanation: The answer is "wke", with
            the length of 3. Notice that the answer must be a substring, "pwke"
            is a subsequence and not a substring.
          </p>
          <h2 className="text-lg font-bold mb-2">Constraints</h2>
          <p className="mb-4">
            {`0 <= s.length <= 5 * 10^4 s consists of English letters, digits,
    symbols and spaces.`}
          </p>

          <h2 className="text-lg font-bold mb-2">Hint</h2>
          <p className="mb-4">Use sliding window technique.</p>

          <h2 className="text-lg font-bold mb-2">Tags</h2>
          <p className="mb-4">Sliding Window, Two Pointers, Hash Table</p>

          <h2 className="text-lg font-bold mb-2">Difficulty</h2>
          <p className="mb-4">Medium</p>

          <h2 className="text-lg font-bold mb-2">Link</h2>
          <a
            href="https://leetcode.com/problems/longest-substring-without-repeating-characters/"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            Longest Substring Without Repeating Characters
          </a>

          <h2 className="text-lg font-bold mb-2">Discussion</h2>
          <p className="mb-4">
            <a
              href="https://leetcode.com/problems/longest-substring-without-repeating-characters/discuss/1339/Sliding-Window-Approach"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Sliding Window Approach
            </a>
          </p>

          <h2 className="text-lg font-bold mb-2">Editorial</h2>
          <p className="mb-4">
            <a
              href="https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Solution
            </a>
          </p>

          <h2 className="text-lg font-bold mb-2">Similar Problems</h2>
          <p className="mb-2">
            <a
              href="https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Longest Substring with At Most Two Distinct Characters
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Longest Substring with At Most K Distinct Characters
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://leetcode.com/problems/substring-with-concatenation-of-all-words/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Substring with Concatenation of All Words
            </a>
          </p>
          <p className="mb-2">
            <a
              href="https://leetcode.com/problems/minimum-window-substring/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Minimum Window Substring
            </a>
          </p>
          <p className="mb-4">
            <a
              href="https://leetcode.com/problems/sliding-window-maximum/"
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              Sliding Window Maximum
            </a>
          </p>
        </div>

        <Separator type={Direction.Vertical} />
        <div className="w-2/3">
          <h1>Code</h1>
        </div>
      </div>
    </Layout>
  );
}
