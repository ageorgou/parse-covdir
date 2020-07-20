const fs = require('fs');
const path = require('path');
const index = require('../index');

test('handle whole sample file', () => {
    let inputData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'covdir.json'))
    );
    let expectedMap = new Map([
        ['.', 50],
        ['./src' , 50],
        ['./src/unicorns.rs' , 75.76],
        ['./src/pictures.rs' , 0],
        ['./src/flowers.rs' , 0],
        ['./src/capybaras.rs' , 95.65]
    ])
    expect(index.processCoverage(inputData, '.')).toEqual(expectedMap);
})

test('check input and output', async () => {
    process.env['INPUT_INPUT-FILE'] = path.join(__dirname, 'covdir.json');
    let out = await index.work();
    let expectedOutput = `.: 50 %
./src: 50 %
./src/unicorns.rs: 75.76 %
./src/pictures.rs: 0 %
./src/flowers.rs: 0 %
./src/capybaras.rs: 95.65 %`
    expect(out).toEqual(expectedOutput);
    // We would like something like the following to check that the action
    // sets its output correctly, but it seems it's not done through variables
    //expect(process.env['OUTPUT_TEXT']).toEqual(expectedOutput); 
})