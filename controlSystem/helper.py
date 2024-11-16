import csv

def readCSVLogFile(filename):
    data = {}
    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        # get headers
        headers = reader.fieldnames
        # get data
        for row in reader:
            datadict = {}
            for header in headers:
                datadict[header] = row[header]
                if header == "TrackDistance":
                    row[header] = int(float(row[header]))
            data[row["TrackDistance"]] = datadict
    return data