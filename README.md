# parse-covdir

This action does simple parsing of JSON file containing code coverage
results. This matches the output of coverage analysis tools like
[grcov](https://github.com/mozilla/grcov)
when targetting the `covdir` output format.

This action does not run any coverage analysis. It assumes that this
has been executed previously and that the results are available in a file.

## Inputs
### input-file
The location of the JSON file to be parsed.

**Default:** `covdir.json`.

## Outputs
### text
A string containing a summary of the coverage information.
Currently there is only a simple format supported but more may be added.

Example output (corresponding to [the test input](./__tests__/covdir.json)):
```
.: 50 %
./src: 50 %
./src/unicorns.rs: 75.76 %
./src/pictures.rs: 0 %
./src/flowers.rs: 0 %
./src/capybaras.rs: 95.65 %
```


## Example usage
```YAML
uses: ageorgou/parse-covdir@v0.1
with:
  input-file: './covdir-json'
```