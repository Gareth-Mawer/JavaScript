/* 
    Sumnation.js
    Author: Gareth Mawer
    License: MIT License

    Copyright (c) 2017 Gareth Mawer

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
    (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
    publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do 
    so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
    FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
    WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
    Description of Program

    This program is a library of functions that allows the user sum a series of numbers of their choosing. Wrapper functions are also 
    written out allowing the user to ignore features of the general sumnation procedure that they don't need. This program is written 
    in a functional style in order to the express the concept of sumnation concisely, it is not optimised to perform the calculation 
    quickly.
    
    The power of the function sumnation is expressed by calculating four constants and two other self-explanatory results that 
    can be approximated by calculating a series of numbers correct to three decimal places.

    The constants are:
        1. An approximate solution to the Basel Problem. 
            The Basel problem involves finding the precise value of the sum of the sequence 1 / (n ^ 2) where n starts at 1
        and continues to infinity. In others the Basel problem wants to find the sum of the sequence 
        1 + 1/2 + 1/9 + 1/16 + 1/25 + .... Euler proved that the precise value is equal to (pi ^ 2) / 6. We can express
        the Basel problem in terms of the Riemann Zeta function. The Basel Problem is the solution to 𝜁(2). 

        The Riemann Zeta Function asserts

            𝜁(s) = (for n from 1 to infinity) SUM [1 / (n ^ s)]

            or,
            
            𝜁(s) = 1 + 1 / (2 ^ s) + 1 / (3 ^ s) + ...

            where,
                s is equal to real part of a given complex number, z. 

        2. The probability that two randomly selected numbers, a and b, are coprime. The probability is the reciprocal of
        the answer to the Basel Problem. Two numbers are coprime if the highest number that can divide both of them is 1. 
        In other words, gcd(a, b) = 1.  

        2. Apéry's Constant - The mathematician Roger Apéry proved that 𝜁(3) is an irrational number, which is Apéry's constant. 

        3. Euler-Mascheroni Constant - The constant is calculated via the following:

            γ = (for m from 2 to infinity) SUM [(-1)^m * (𝜁(m) / m)]

        4. Pi - We calculate pi using our solution to the Basel problem.

*/

/* Library consisting of functions that will sum a sequence of numbers */

/* sumnation :: (function, function, number, function, number) -> number
   Sums a sequence of numbers. 

   Assumes:
        f :: number -> number
        filter :: number -> Bool
        next :: number -> number

        f is a function applied to each element of the sequence. 
        
        filter is a procedure that discriminates certain values of the sequence. 
        Allowing you to sum the prime numbers in a given interval, for example.

        next is a function calculating the next element in the sequence.

        a is the first element of the sequence.
        b is the last element of the sequence.
*/
function sumnation(f, filter, a, next, b) {
    var i = a;
    var answer = 0;
    while (i <= b) {
        if (filter(i)) {
            answer += f(i);
        }
        i = next(i);
    }
    return answer;
}

/* add :: (number, number) -> number 
   Sums a sequence of numbers in which a is the start of the sequence and b is the last element of the sequence. It is assumed 
   that the next element of the sequence is the increment of the present one.
*/
function add(a, b) {
    return sumnation((x => x),
                     (x => true),
                     a,
                     (x => x + 1),
                     b);
}

/* filtered_add :: (function, number, number) -> number
   Sums a sequence of numbers while allowing the user to filter certain numbers, e.g. finding sum the prime numbers between 
   1 and 1000. It is assumed that next elemment of the sequence is the increment of the present one. */
function filtered_add(filter, a, b) {
    return sumnation((x => x),
                     filter,
                     a,
                     (x => x + 1),
                     b);
}

/* addition :: (function, number, number) -> number 
   Sums a sequence of numbers while granting the user the ability to manipulate each term in the sequence, e.g. finding
   the sum of the cubes of the numbers between 1 and 1000. The user cannot choose how the next element of the sequence is 
   chosen and they cannot filter out certain values of the sequence. 
*/
function addition(f, a, b) {
    return sumnation(f,
                     (x => true),
                     a,
                     (x => x + 1),
                     b);
}

/* filtered_addition :: (function, function, number, number) -> number
    Sums a sequence of numbers while allowing the user to filter out certain numbers of the sequences and manipulate each 
    term in the sequence, e.g. the sum of the square of the prime numbers between 1 and 1000. It is assumed that the next 
    element of the sequence is the increment of the present one.
*/
function filtered_addition(f, filter, a, b) {
    return sumnation(f,
                     filter,
                     a,
                     (x => x + 1),
                     b);
}

/* Example demonstrating the functions at work. */

const lower_limit = 1
const upper_limit = 1000000

/* inverse_exponentiation :: number -> function 
   A procedure that takes as it's argument an exponent, exp, for a number, n,
   and returns a function that takes as it argument the number n which will 
   calculate 1 / (n ^ exp). 
*/
function inverse_exponentiation(exp) {
    return (n => 1 / (n ** exp));
}

/* riemann_zeta_function :: real number -> number
   Assumes that s is the real part of a complex number
*/
function riemann_zeta_function(s) {
    return addition(inverse_exponentiation(s),
                    lower_limit,
                    upper_limit);
}

/* gamma_expression :: real number -> number 
   Assumes that m is the real part of a complex number
*/
function gamma_expression(m) {
    return ((-1) ** m) * (riemann_zeta_function(m) / m);
}

/* simpsons_rule :: (function, number, number, number) -> number
   Calculates the integral of a function, f, between the interval a to b. Assuming that n is the number determiming 
   the precision of the approximation. 
*/
function simpsons_rule(f, a, b, n) {
    var h = (b - a) / n
    
    function y(k) {
        return f(a + (k * h))
    }

    function simpson_coefficient(k) {
        if (k === 0) {
            return y(k);
        } else if (k % 2 === 0) {
            return 2 * y(k);
        } else {
            return 4 * y(k);
        }
    }

    return (h / 3) * addition(simpson_coefficient, 0, n);
}

/* coprime :: number -> function
   Determines if the ith element of a sequence is a coprime with the last number of a given sequence 
*/
function coprime(n) {
    function gcd(a, b) {
        if (b == 0) {
            return a
        } else {
            return gcd(b, a % b)
        }
    }
    // Assumes that i < n
    return (i => gcd(i, n) == 1)
}

var basel_problem = riemann_zeta_function(2);

var apérys_constant = riemann_zeta_function(3);

var integral_of_cube_between_0_and_1 = simpsons_rule((x => x * x * x),
                                                     0,
                                                     1,
                                                     upper_limit);

var sum_of_coprimes = filtered_add(coprime(upper_limit), lower_limit, upper_limit)

// The below computation should only be peformed on a powerful machine //

//var euler_mascheroni_constant = addition(gamma_expression, 2, upper_limit);

console.log("An approximation of the solution to the Basel Problem: ", basel_problem)

console.log("The probability that two randomly selected numbers are coprime is: ", 1 / basel_problem);

console.log("The approximation of pi using our solution to the Basel problem: ", Math.sqrt(6 * basel_problem))

console.log("Apéry's Constant is: ", apérys_constant);

console.log("The area under the curve between 0 and 1 of the function f(x) = x^3 is: ", integral_of_cube_between_0_and_1)

console.log("The sum of the coprimes between 1 and 100000 is: ", sum_of_coprimes)

//console.log("The Euler-Mascheroni Constant is: ", euler_mascheroni_constant);