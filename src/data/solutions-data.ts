import { ChapterSolutions, Exercise, QuestionSolution } from "@/types";

// ============================================================
// SOLUTIONS DATA — Ganita Manjari (Mathematics)
// Structured as Class → Subject → Chapter → Exercise → Question
// ============================================================

const mathSolutions: ChapterSolutions[] = [
  // ===== CLASS 10 MATHEMATICS =====
  {
    classId: 10,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Real Numbers",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "10-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Use Euclid's division algorithm to find the HCF of: **135 and 225**",
            solution: [
              { step: 1, content: "Apply Euclid's division lemma to 225 and 135:" },
              { step: 2, content: "$$225 = 135 \\times 1 + 90$$" },
              { step: 3, content: "Since remainder ≠ 0, apply division lemma to 135 and 90:" },
              { step: 4, content: "$$135 = 90 \\times 1 + 45$$" },
              { step: 5, content: "Since remainder ≠ 0, apply division lemma to 90 and 45:" },
              { step: 6, content: "$$90 = 45 \\times 2 + 0$$" },
              { step: 7, content: "The remainder is now 0, so the HCF is **45**." },
            ],
            answer: "$$\\text{HCF}(135, 225) = 45$$",
            formulaBox: {
              title: "Euclid's Division Algorithm",
              content: "$$a = bq + r, \\quad 0 \\le r < b$$"
            },
            notes: "Euclid's division algorithm is based on the principle that the HCF of two numbers does not change if the larger number is replaced by its difference with the smaller number."
          },
          {
            id: "10-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Show that any positive odd integer is of the form $6q + 1$, $6q + 3$ or $6q + 5$, where $q$ is some integer.",
            solution: [
              { step: 1, content: "Let $a$ be any positive odd integer. By Euclid's division lemma, for $a$ and $b = 6$:" },
              { step: 2, content: "$$a = 6q + r, \\quad \\text{where } 0 \\le r < 6$$" },
              { step: 3, content: "So $r$ can be $0, 1, 2, 3, 4, 5$." },
              { step: 4, content: "If $r = 0$: $a = 6q$, which is even." },
              { step: 5, content: "If $r = 1$: $a = 6q + 1$, which is odd." },
              { step: 6, content: "If $r = 2$: $a = 6q + 2 = 2(3q + 1)$, which is even." },
              { step: 7, content: "If $r = 3$: $a = 6q + 3 = 3(2q + 1)$, which is odd." },
              { step: 8, content: "If $r = 4$: $a = 6q + 4 = 2(3q + 2)$, which is even." },
              { step: 9, content: "If $r = 5$: $a = 6q + 5$, which is odd." },
              { step: 10, content: "Therefore, any positive odd integer is of the form $6q + 1$, $6q + 3$, or $6q + 5$." },
            ],
            answer: "Any positive odd integer can be expressed as $6q + 1$, $6q + 3$, or $6q + 5$.",
            formulaBox: {
              title: "Division Algorithm",
              content: "$$a = bq + r, \\quad 0 \\le r < b$$"
            }
          },
          {
            id: "10-math-0-ex1.1-q3",
            questionNumber: 3,
            question: "Find the HCF of 96 and 404 by the prime factorization method. Hence, find their LCM.",
            solution: [
              { step: 1, content: "Prime factorize 96:" },
              { step: 2, content: "$$96 = 2^5 \\times 3$$" },
              { step: 3, content: "Prime factorize 404:" },
              { step: 4, content: "$$404 = 2^2 \\times 101$$" },
              { step: 5, content: "HCF is the product of the smallest power of common prime factors:" },
              { step: 6, content: "$$\\text{HCF}(96, 404) = 2^2 = 4$$" },
              { step: 7, content: "LCM is the product of the greatest power of all prime factors:" },
              { step: 8, content: "$$\\text{LCM}(96, 404) = 2^5 \\times 3 \\times 101 = 32 \\times 3 \\times 101 = 9696$$" },
              { step: 9, content: "Verification: $$\\text{HCF} \\times \\text{LCM} = 4 \\times 9696 = 38784 = 96 \\times 404$$ ✓" },
            ],
            answer: "$$\\text{HCF} = 4,\\quad \\text{LCM} = 9696$$",
            formulaBox: {
              title: "Relation between HCF and LCM",
              content: "$$\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b$$"
            }
          },
          {
            id: "10-math-0-ex1.1-q4",
            questionNumber: 4,
            question: "Given that HCF(306, 657) = 9, find LCM(306, 657).",
            solution: [
              { step: 1, content: "We know that for any two positive integers $a$ and $b$:" },
              { step: 2, content: "$$\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b$$" },
              { step: 3, content: "Given: HCF(306, 657) = 9" },
              { step: 4, content: "$$\\text{LCM}(306, 657) = \\frac{306 \\times 657}{\\text{HCF}(306, 657)}$$" },
              { step: 5, content: "$$= \\frac{306 \\times 657}{9}$$" },
              { step: 6, content: "$$= 34 \\times 657 = 22338$$" },
            ],
            answer: "$$\\text{LCM}(306, 657) = 22338$$"
          },
          {
            id: "10-math-0-ex1.1-q5",
            questionNumber: 5,
            question: "Check whether $6^n$ can end with the digit 0 for any natural number $n$.",
            solution: [
              { step: 1, content: "If a number ends with digit 0, it must be divisible by 10 = $2 \\times 5$." },
              { step: 2, content: "This means the number must have both 2 and 5 as prime factors." },
              { step: 3, content: "Prime factorization of 6:" },
              { step: 4, content: "$$6 = 2 \\times 3$$" },
              { step: 5, content: "Therefore:" },
              { step: 6, content: "$$6^n = (2 \\times 3)^n = 2^n \\times 3^n$$" },
              { step: 7, content: "We can see that $6^n$ has only prime factors 2 and 3. It does **not** have the prime factor 5." },
              { step: 8, content: "Since $6^n$ does not contain the factor 5, it cannot end with digit 0 for any natural number $n$." },
            ],
            answer: "No, $6^n$ cannot end with digit 0 for any natural number $n$.",
            notes: "For a number to end with digit 0, it must be divisible by 10, which requires the prime factors 2 and 5."
          },
          {
            id: "10-math-0-ex1.1-q6",
            questionNumber: 6,
            question: "Explain why $7 \\times 11 \\times 13 + 13$ and $7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 + 5$ are composite numbers.",
            solution: [
              { step: 1, content: "Consider the first number:" },
              { step: 2, content: "$$7 \\times 11 \\times 13 + 13 = 13(7 \\times 11 + 1) = 13(77 + 1) = 13 \\times 78$$" },
              { step: 3, content: "$$= 13 \\times 78 = 13 \\times 2 \\times 3 \\times 13 = 2 \\times 3 \\times 13^2$$" },
              { step: 4, content: "This number has factors other than 1 and itself, so it is **composite**." },
              { step: 5, content: "Now consider the second number:" },
              { step: 6, content: "$$7 \\times 6 \\times 5 \\times 4 \\times 3 \\times 2 \\times 1 + 5 = 5(7 \\times 6 \\times 4 \\times 3 \\times 2 \\times 1 + 1)$$" },
              { step: 7, content: "$$= 5(1008 + 1) = 5 \\times 1009$$" },
              { step: 8, content: "Since 1009 is not equal to 1 or 5, this number has factors 5 and 1009." },
              { step: 9, content: "Therefore, both numbers are **composite**." },
            ],
            answer: "Both numbers can be expressed as products of two integers > 1, hence they are composite."
          }
        ]
      },
      {
        name: "Exercise 1.2",
        questions: [
          {
            id: "10-math-0-ex1.2-q1",
            questionNumber: 1,
            question: "Express each number as a product of its prime factors: **140**",
            solution: [
              { step: 1, content: "Start dividing by the smallest prime number:" },
              { step: 2, content: "$$140 = 2 \\times 70$$" },
              { step: 3, content: "$$= 2 \\times 2 \\times 35$$" },
              { step: 4, content: "$$= 2 \\times 2 \\times 5 \\times 7$$" },
              { step: 5, content: "$$= 2^2 \\times 5 \\times 7$$" },
            ],
            answer: "$$140 = 2^2 \\times 5 \\times 7$$"
          },
          {
            id: "10-math-0-ex1.2-q2",
            questionNumber: 2,
            question: "Find the LCM and HCF of the following pairs of integers and verify that LCM × HCF = product of the two numbers: **(i) 26 and 91**",
            solution: [
              { step: 1, content: "Prime factorize 26:" },
              { step: 2, content: "$$26 = 2 \\times 13$$" },
              { step: 3, content: "Prime factorize 91:" },
              { step: 4, content: "$$91 = 7 \\times 13$$" },
              { step: 5, content: "HCF = product of common prime factors with smallest power:" },
              { step: 6, content: "$$\\text{HCF} = 13$$" },
              { step: 7, content: "LCM = product of all prime factors with greatest power:" },
              { step: 8, content: "$$\\text{LCM} = 2 \\times 7 \\times 13 = 182$$" },
              { step: 9, content: "Verification:" },
              { step: 10, content: "$$\\text{HCF} \\times \\text{LCM} = 13 \\times 182 = 2366 = 26 \\times 91$$ ✓" },
            ],
            answer: "$$\\text{HCF} = 13,\\quad \\text{LCM} = 182$$"
          },
          {
            id: "10-math-0-ex1.2-q3",
            questionNumber: 3,
            question: "Find the LCM and HCF of the following integers by prime factorization method: **12, 15 and 21**",
            solution: [
              { step: 1, content: "Prime factorize each number:" },
              { step: 2, content: "$$12 = 2^2 \\times 3$$" },
              { step: 3, content: "$$15 = 3 \\times 5$$" },
              { step: 4, content: "$$21 = 3 \\times 7$$" },
              { step: 5, content: "HCF = product of common prime factors with smallest power:" },
              { step: 6, content: "The only common prime factor is 3 (with smallest power $3^1$)." },
              { step: 7, content: "$$\\text{HCF} = 3$$" },
              { step: 8, content: "LCM = product of all prime factors with greatest power:" },
              { step: 9, content: "$$\\text{LCM} = 2^2 \\times 3 \\times 5 \\times 7 = 4 \\times 3 \\times 5 \\times 7 = 420$$" },
            ],
            answer: "$$\\text{HCF} = 3,\\quad \\text{LCM} = 420$$"
          }
        ]
      }
    ]
  },

  // ===== CLASS 12 MATHEMATICS =====
  {
    classId: 12,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Relations and Functions",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "12-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Determine whether each of the following relations are reflexive, symmetric and transitive: **Relation R in the set A = {1, 2, 3, ..., 14} defined as $R = \\{(x, y) : 3x - y = 0\\}$**",
            solution: [
              { step: 1, content: "Given $A = \\{1, 2, 3, ..., 14\\}$ and $R = \\{(x, y) : 3x - y = 0\\}$." },
              { step: 2, content: "This means $y = 3x$, so $R = \\{(1,3), (2,6), (3,9), (4,12)\\}$" },
              { step: 3, content: "**Reflexive**: For any $x \\in A$, we need $(x,x) \\in R$. This would require $3x - x = 0$ or $2x = 0$, which is false for $x \\neq 0$. Since no such pair exists, $R$ is **not reflexive**." },
              { step: 4, content: "**Symmetric**: For $(x,y) \\in R$, we need $(y,x) \\in R$. If $(x,y) \\in R$, then $3x - y = 0$. For symmetry, $3y - x = 0$ must hold. But $3y - x = 3(3x) - x = 9x - x = 8x \\neq 0$ (except $x=0$). So $R$ is **not symmetric**." },
              { step: 5, content: "**Transitive**: For $(x,y) \\in R$ and $(y,z) \\in R$, we need $(x,z) \\in R$. If $(x,y) \\in R$ then $y = 3x$. If $(y,z) \\in R$ then $z = 3y = 3(3x) = 9x$. Then $3x - z = 3x - 9x = -6x \\neq 0$ (except $x=0$). So $R$ is **not transitive**." },
            ],
            answer: "$R$ is neither reflexive, nor symmetric, nor transitive.",
            formulaBox: {
              title: "Properties of Relations",
              content: "Reflexive: $\\forall x \\in A, (x,x) \\in R$\nSymmetric: $(x,y) \\in R \\implies (y,x) \\in R$\nTransitive: $(x,y) \\in R, (y,z) \\in R \\implies (x,z) \\in R$"
            }
          },
          {
            id: "12-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Determine whether the relation R in the set A = {1, 2, 3, 4, 5, 6} defined as $R = \\{(x, y) : y$ is divisible by $x\\}$ is reflexive, symmetric and transitive.",
            solution: [
              { step: 1, content: "Given $A = \\{1, 2, 3, 4, 5, 6\\}$ and $R = \\{(x, y) : y$ is divisible by $x\\}$" },
              { step: 2, content: "**Reflexive**: For any $x \\in A$, $x$ is divisible by $x$ (since $x = x \\times 1$). So $(x,x) \\in R$ for all $x \\in A$. Therefore $R$ is **reflexive**." },
              { step: 3, content: "**Symmetric**: If $(x,y) \\in R$, then $y$ is divisible by $x$. Does this imply $x$ is divisible by $y$? No. For example, $(1,2) \\in R$ because 2 is divisible by 1, but $(2,1) \\notin R$ because 1 is not divisible by 2. Therefore $R$ is **not symmetric**." },
              { step: 4, content: "**Transitive**: If $(x,y) \\in R$ and $(y,z) \\in R$, then $y$ is divisible by $x$ and $z$ is divisible by $y$. Thus $y = xk_1$ and $z = yk_2$ for some integers $k_1, k_2$. So $z = (xk_1)k_2 = x(k_1k_2)$, which means $z$ is divisible by $x$. Therefore $(x,z) \\in R$. Hence $R$ is **transitive**." },
            ],
            answer: "$R$ is reflexive and transitive, but not symmetric.",
            tableData: {
              headers: ["Property", "Result", "Reason"],
              rows: [
                ["Reflexive", "Yes", "$x$ is divisible by $x$ for all $x$"],
                ["Symmetric", "No", "$y$ divisible by $x$ does not imply $x$ divisible by $y$"],
                ["Transitive", "Yes", "$y = xk_1,\\; z = yk_2 \\implies z = x(k_1k_2)$"]
              ]
            }
          }
        ]
      }
    ]
  },

  // ===== CLASS 6 MATHEMATICS =====
  {
    classId: 6,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Knowing Our Numbers",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "6-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Fill in the blanks: **(a) 1 lakh = _____ ten thousand**",
            solution: [
              { step: 1, content: "We know that:" },
              { step: 2, content: "$$1 \\text{ lakh} = 100,000$$" },
              { step: 3, content: "$$1 \\text{ ten thousand} = 10,000$$" },
              { step: 4, content: "Number of ten thousands in 1 lakh:" },
              { step: 5, content: "$$\\frac{100,000}{10,000} = 10$$" },
              { step: 6, content: "Therefore, **1 lakh = 10 ten thousand**." },
            ],
            answer: "$$1 \\text{ lakh} = 10 \\text{ ten thousand}$$",
            tableData: {
              headers: ["Number", "Indian System", "International System"],
              rows: [
                ["100", "Hundred", "Hundred"],
                ["1,000", "Thousand", "Thousand"],
                ["10,000", "Ten Thousand", "Ten Thousand"],
                ["1,00,000", "1 Lakh", "Hundred Thousand"],
                ["10,00,000", "10 Lakh", "Million"]
              ]
            }
          },
          {
            id: "6-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Place commas correctly and write the numerals: **(a) Seventy-three lakh seventy-five thousand three hundred seven**",
            solution: [
              { step: 1, content: "Let's break down the number in the Indian system:" },
              { step: 2, content: "Seventy-three lakh = $73,00,000$" },
              { step: 3, content: "Seventy-five thousand = $75,000$" },
              { step: 4, content: "Three hundred seven = $307$" },
              { step: 5, content: "Adding all parts:" },
              { step: 6, content: "$$73,00,000 + 75,000 + 307 = 73,75,307$$" },
              { step: 7, content: "Therefore, the numeral is **73,75,307**." },
            ],
            answer: "$$73,75,307$$"
          }
        ]
      }
    ]
  },

  // ===== CLASS 7 MATHEMATICS =====
  {
    classId: 7,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Integers",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "7-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Write the integer that represents each of the following situations: **(a) A gain of ₹500**",
            solution: [
              { step: 1, content: "Positive integers represent gains, increases, or movements to the right." },
              { step: 2, content: "A gain of ₹500 is represented by the positive integer **+500** or simply **500**." },
              { step: 3, content: "In general, gains, profits, deposits, and ascents are represented by positive integers." },
            ],
            answer: "$$+500 \\text{ or } 500$$",
            notes: "Gains are represented by positive integers, while losses are represented by negative integers."
          },
          {
            id: "7-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Represent the following numbers on a number line: **(a) +5**",
            solution: [
              { step: 1, content: "Draw a number line with 0 at the center." },
              { step: 2, content: "Positive numbers are to the right of 0." },
              { step: 3, content: "To represent +5, start at 0 and move 5 units to the right." },
              { step: 4, content: "The point at 5 units to the right of 0 represents +5." },
              { step: 5, content: "Diagram:" },
              { step: 6, content: "←---|---|---|---|---|---|---|---|---|---→\n  -4  -3  -2  -1   0   1   2   3   4  **5**" },
            ],
            answer: "+5 is located 5 units to the right of 0 on the number line."
          }
        ]
      }
    ]
  },

  // ===== CLASS 8 MATHEMATICS =====
  {
    classId: 8,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Rational Numbers",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "8-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Using appropriate properties, find: $$\\frac{2}{3} \\times \\frac{3}{5} + \\frac{5}{2} - \\frac{3}{5} \\times \\frac{1}{6}$$",
            solution: [
              { step: 1, content: "Let's rearrange using the commutative property of multiplication:" },
              { step: 2, content: "$$\\frac{2}{3} \\times \\frac{3}{5} - \\frac{3}{5} \\times \\frac{1}{6} + \\frac{5}{2}$$" },
              { step: 3, content: "Take $\\frac{3}{5}$ common from the first two terms:" },
              { step: 4, content: "$$= \\frac{3}{5}\\left(\\frac{2}{3} - \\frac{1}{6}\\right) + \\frac{5}{2}$$" },
              { step: 5, content: "$$= \\frac{3}{5}\\left(\\frac{4 - 1}{6}\\right) + \\frac{5}{2}$$" },
              { step: 6, content: "$$= \\frac{3}{5} \\times \\frac{3}{6} + \\frac{5}{2}$$" },
              { step: 7, content: "$$= \\frac{3}{5} \\times \\frac{1}{2} + \\frac{5}{2}$$" },
              { step: 8, content: "$$= \\frac{3}{10} + \\frac{5}{2}$$" },
              { step: 9, content: "$$= \\frac{3}{10} + \\frac{25}{10} = \\frac{28}{10} = \\frac{14}{5}$$" },
            ],
            answer: "$$\\frac{14}{5}$$",
            formulaBox: {
              title: "Properties of Rational Numbers",
              content: "Commutative: $a \\times b = b \\times a$\nDistributive: $a \\times (b + c) = a \\times b + a \\times c$"
            }
          }
        ]
      }
    ]
  },

  // ===== CLASS 9 MATHEMATICS =====
  {
    classId: 9,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Number Systems",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "9-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Is zero a rational number? Can you write it in the form $\\frac{p}{q}$, where $p$ and $q$ are integers and $q \\neq 0$?",
            solution: [
              { step: 1, content: "A rational number is any number that can be expressed in the form $\\frac{p}{q}$, where $p$ and $q$ are integers and $q \\neq 0$." },
              { step: 2, content: "Zero can be expressed in this form:" },
              { step: 3, content: "$$0 = \\frac{0}{1} = \\frac{0}{2} = \\frac{0}{3} = \\dots$$" },
              { step: 4, content: "Since 0 can be written as $\\frac{0}{q}$ for any non-zero integer $q$, zero **is** a rational number." },
            ],
            answer: "Yes, zero is a rational number. It can be written as $\\frac{0}{1}, \\frac{0}{2}, \\frac{0}{3}$, etc.",
            formulaBox: {
              title: "Definition of Rational Number",
              content: "$$\\text{A number is rational if it can be written as } \\frac{p}{q}, \\; p,q \\in \\mathbb{Z}, \\; q \\neq 0$$"
            }
          },
          {
            id: "9-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Find six rational numbers between 3 and 4.",
            solution: [
              { step: 1, content: "We know that between any two rational numbers, there exist infinitely many rational numbers." },
              { step: 2, content: "Write 3 and 4 with denominator 7:" },
              { step: 3, content: "$$3 = \\frac{21}{7} \\quad \\text{and} \\quad 4 = \\frac{28}{7}$$" },
              { step: 4, content: "Now the numbers between $\\frac{21}{7}$ and $\\frac{28}{7}$ are:" },
              { step: 5, content: "$$\\frac{22}{7}, \\frac{23}{7}, \\frac{24}{7}, \\frac{25}{7}, \\frac{26}{7}, \\frac{27}{7}$$" },
              { step: 6, content: "These are six rational numbers between 3 and 4." },
            ],
            answer: "$$\\frac{22}{7}, \\frac{23}{7}, \\frac{24}{7}, \\frac{25}{7}, \\frac{26}{7}, \\frac{27}{7}$$",
            notes: "Alternative method: Use the formula $\\frac{a+b}{2}$ recursively to find rational numbers between any two numbers."
          }
        ]
      }
    ]
  },

  // ===== CLASS 11 MATHEMATICS =====
  {
    classId: 11,
    subject: "Mathematics",
    chapterIdx: 0,
    chapterName: "Sets",
    exercises: [
      {
        name: "Exercise 1.1",
        questions: [
          {
            id: "11-math-0-ex1.1-q1",
            questionNumber: 1,
            question: "Which of the following are sets? Justify your answer. **(a) The collection of all months of a year beginning with the letter J.**",
            solution: [
              { step: 1, content: "A set is a well-defined collection of distinct objects." },
              { step: 2, content: "The months beginning with J are: January, June, July." },
              { step: 3, content: "This collection is well-defined because we can clearly determine whether a given month belongs to it or not." },
              { step: 4, content: "Therefore, this **is** a set." },
            ],
            answer: "Yes, it is a set: {January, June, July}",
            formulaBox: {
              title: "Definition of a Set",
              content: "A set is a well-defined collection of distinct objects, called elements or members of the set."
            }
          },
          {
            id: "11-math-0-ex1.1-q2",
            questionNumber: 2,
            question: "Let $A = \\{1, 2, 3, 4, 5, 6\\}$. Write the set $\\{x : x \\in A \\text{ and } x \\text{ is even}\\}$ in roster form.",
            solution: [
              { step: 1, content: "Given $A = \\{1, 2, 3, 4, 5, 6\\}$" },
              { step: 2, content: "The even numbers in set A are: 2, 4, 6" },
              { step: 3, content: "Therefore, in roster form:" },
              { step: 4, content: "$$\\{x : x \\in A \\text{ and } x \\text{ is even}\\} = \\{2, 4, 6\\}$$" },
            ],
            answer: "$$\\{2, 4, 6\\}$$"
          }
        ]
      }
    ]
  }
];

// Helper to get solution by chapter key
export function getChapterSolutionsKey(classId: number, subject: string, chapterIdx: number): string {
  return `${classId}-${subject.toLowerCase()}-${chapterIdx}`;
}

// Get all exercises for a chapter
export function getExercisesForChapter(classId: number, subject: string, chapterIdx: number): Exercise[] {
  const solution = mathSolutions.find(
    (s) => s.classId === classId && s.subject === subject && s.chapterIdx === chapterIdx
  );
  return solution?.exercises || [];
}

// Get all questions for a specific exercise in a chapter
export function getQuestionsForExercise(
  classId: number,
  subject: string,
  chapterIdx: number,
  exerciseName: string
): QuestionSolution[] {
  const exercises = getExercisesForChapter(classId, subject, chapterIdx);
  const exercise = exercises.find((e) => e.name === exerciseName);
  return exercise?.questions || [];
}

// Get a specific question by ID
export function getQuestionById(questionId: string): QuestionSolution | undefined {
  for (const chapter of mathSolutions) {
    for (const exercise of chapter.exercises) {
      const question = exercise.questions.find((q) => q.id === questionId);
      if (question) return question;
    }
  }
  return undefined;
}

// Search across all solutions
export function searchSolutions(query: string): Array<{
  chapterName: string;
  exerciseName: string;
  question: QuestionSolution;
  classId: number;
  subject: string;
  chapterIdx: number;
}> {
  if (!query || query.length < 2) return [];
  const lq = query.toLowerCase();
  const results: Array<{
    chapterName: string;
    exerciseName: string;
    question: QuestionSolution;
    classId: number;
    subject: string;
    chapterIdx: number;
  }> = [];

  for (const chapter of mathSolutions) {
    for (const exercise of chapter.exercises) {
      for (const question of exercise.questions) {
        const searchText = `${question.questionNumber} ${question.question} ${question.answer || ""} ${question.notes || ""} ${exercise.name} ${chapter.chapterName}`.toLowerCase();
        if (searchText.includes(lq)) {
          results.push({
            chapterName: chapter.chapterName,
            exerciseName: exercise.name,
            question,
            classId: chapter.classId,
            subject: chapter.subject,
            chapterIdx: chapter.chapterIdx,
          });
        }
      }
    }
  }

  return results.slice(0, 20);
}

// Check if a chapter has solutions
export function hasChapterSolutions(classId: number, subject: string, chapterIdx: number): boolean {
  return mathSolutions.some(
    (s) => s.classId === classId && s.subject === subject && s.chapterIdx === chapterIdx
  );
}

// Get all chapter keys that have solutions
export function getAvailableSolutionChapters(): string[] {
  return mathSolutions.map((s) => getChapterSolutionsKey(s.classId, s.subject, s.chapterIdx));
}

export default mathSolutions;
