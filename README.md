# Onna QA sample smoketests 

Here are some sample smoketests written to showcase Aquifer, the UI automation framework I wrote, and to play with Onna's knowledge integration platform a little.

## Installation

``npm i``

Next, create a file ``.passwords`` in the project root directory modeled after ``.passwords-example``


You need to have the java jdk installed and probably Chrome 84.

## Usage

To run all 3 Onna smoketests, headless:

``npm run new -- -s guest.smoke,admin.smoke,onnalogin``


To run a single test with an open Chrome browser:

``npm run new -- -s login --notHeadless``