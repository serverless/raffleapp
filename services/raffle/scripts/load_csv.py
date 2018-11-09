import argparse
import csv
import os.path

from lib import db


def is_valid_file(parser, arg):
    if not os.path.exists(arg):
        parser.error("The file %s does not exist!" % arg)
    return arg


parser = argparse.ArgumentParser()
parser.add_argument('-f', '--filename', dest='filename', required=True,
                    help="Input CSV file",
                    type=lambda x: is_valid_file(parser, x))
parser.add_argument('-s', '--shortcode', dest='shortcode', required=True,
                    help='Raffle shortcode', type=str)
parser.add_argument('-c', '--column', dest='column', required=False,
                    default='name', help='Column to use for identifier', type=str)


if __name__ == "__main__":
    args = parser.parse_args()

    entries = []
    with open(args.filename, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            db.register_for_raffle(
                args.shortcode,
                row[args.column]
            )
