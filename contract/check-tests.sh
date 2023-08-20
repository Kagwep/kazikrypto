#!/bin/bash
# cd contract
# Get the list of all functions in the smart contract
functions=$(truffle run compile --contracts | grep -E "function|constructor")

# Loop through the list of functions
for function in $functions; do

  # Check if there is a test file for the function
  test_file=$(echo $function | sed 's/function/test/')
  if [ ! -f $test_file ]; then
    echo "No test file found for function $function"
    exit 1
  fi

done

# If we get to this point, all functions have tests
echo "All functions have tests"
exit 0