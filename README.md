# Algolia Index Comparisoniser

A tool for comparing sys and prod Algolia indicies

## Set-up

1. Set-up [algolia CLI](https://www.algolia.com/doc/tools/cli/get-started/authentication/) on your system
2. Install dependencies run `npm install` in project file

## Get data from Algolia
1. Open powershell as admin
2. cd to project folder
3. you will need to have a profile configured in Algolia CLI for both prod and sys indicies i set up my default to the sys index
4. run the following commands to write data to files.

Production:

`algolia objects browse prd_intrepid_departure > test-prod.ndjson -p YOUR Prod PROFILE`

Sys:

`algolia objects browse sys_intrepid_departure > test-sys.ndjson`

5. check the test-sys.ndjson and test-prod.ndjson files are populated
6. open each file in notepad++ 
7. from the `encoding` menu select utf-8 (if you dont do this you will get the unexpected character error)
8. backspace the empty line at the bottom of each file
9. in a terminal cd to the project folder
10. run `node compare.js`
11. you should see some console log outputs
12. check the unique-<env>-diff.ndjson files to get an array of the product ids that are unqiue to each environment. 


NOTE: ignore the find-broken file. It was for troubleshooting


