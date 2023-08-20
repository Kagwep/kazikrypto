#!/bin/bash

# Compile contracts
truffle compile

# Extract all functions 

ARTIFACTS=$(find build/contracts -name  "KaziKrypto.json")
> all_functions.txt

for FILE in $ARTIFACTS; do
  FUNCTIONS=$(cat $FILE | jq -r '.abi | map(select(.type == "function")) | .[].signature')
  echo $FUNCTIONS >> all_functions.txt
done

# Get tested functions
grep -E 'functionName\(.*\)' test/*.js | sed 's/^.*(\(.*\)).*$/\1/' > tested_functions.txt

# Compare 
diff all_functions.txt tested_functions.txt

# Output results
if [ $? -eq 0 ]; then

  echo "Tested Functions:"
  cat tested_functions.txt

  echo "All functions covered!"
  exit 0

else

  echo "Missing function coverage!"
  exit 1

fi
# #!/bin/bash
# # cd contract
# # Compile contracts
# truffle compile

# # Extract function signatures from artifacts
# ARTIFACTS=$(find build/contracts -name "*.json")
# > compiled.txt

# for FILE in $ARTIFACTS; do
#   FUNCTIONS=$(cat $FILE | jq -r '.abi | map(select(.type == "function")) | .[].signature' )
#   echo $FUNCTIONS >> compiled.txt
# done

# # Get called functions from tests
# grep -E 'functionName\(.*\)' test/*.js | sed 's/^.*(\(.*\)).*$/\1/' > tested.txt

# # Compare
# diff compiled.txt tested.txt

# # Check for diff
# if [ $? -eq 0 ]; then
#   echo "All functions covered!"
#   exit 0
# else 
#   echo "Missing function coverage!"
#   exit 1
# fi