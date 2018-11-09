## Scripts

### Load CSV script

The `scripts/load_csv.py` script is used to load a bunch of users from a CSV file into a raffle.

#### Usage

1. [Create a new raffle](https://raffle.serverless.com/create) from the admin. Save the shortcode that you've created.

2. From the root directory of the `raffle` service, install the required dependencies:

	```bash
	pip install -r requirements.txt
	```
	
3. Set the environment variables for the Raffles table and the Entries table:

	```bash
	export RAFFLE_TABLE=raffle-py-dev-RafflesDynamoDBTable-GHFN2BJP9OLF
	export ENTRY_TABLE=raffle-py-dev-EntriesDynamoDBTable-TPX47C23T8IX
	```

4. Run the script from the root directory of the `raffle` service. Use `--filename` to provide the path to your file, and `--shortcode` to provide your shortcode. If your column's name is something other than `name`, provide that with `--column`.

	```bash
	PYTHONPATH=. python3 scripts/load_csv.py -f names.csv -s 1k3j41
	```

You will need an AWS profile that has permission to read and write to the DynamoDB tables.