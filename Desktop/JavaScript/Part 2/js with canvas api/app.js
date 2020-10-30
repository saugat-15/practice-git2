const {Engine, Render, Runner, Bodies, World} = Matter;

const cells = 3;
const width = 600;
const height = 600;

const unitLength = width / cells;

 const engine = Engine.create();
 const {world} = engine;
 const render = Render.create({
     element : document.body,
     engine : engine,
     options : {
         wireframes : true,
         width,
         height
     }
 });
 Render.run(render);
 Runner.run(Runner.create(), engine);


//  const shape = Bodies.circle(200, 200, 50, {
//     // first two components inside the parens are x,y of the object from the top of canvas.
//     // the last two components are the height and width of the object
//     isStatic : true
//     // isStatic: true will keep the shape from falling to the bottom of the canvas. 
//     // this is a real world library so the gravitational pull is also a factor
//  });

// walls
const walls = [
    Bodies.rectangle(width / 2, 0, width, 50, {isStatic : true}),
    Bodies.rectangle(0, height / 2, 50, height, {isStatic : true}),
    Bodies.rectangle(width,height/2,50,height, {isStatic : true}),
    Bodies.rectangle(width / 2, height, 600,50, {isStatic : true})

]

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
}

const grid = Array(cells)
    .fill([null])
    .map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false))

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false))

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
 
 
const stepThroughCell = (row,column) => {
// If i have visited the cell at [row,column], then return

if(grid[row][column]) return;

// Mark this cell as visited
grid[row][column] = true;

// Assemble randomly ordered list of neighbors

const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
]);
//  console.log(neighbors);
// for each neighbor;

for(let neighbor of neighbors) {
const [nextRow, nextColumn, direction] = neighbor;


// if the neighbor is out of bounds

if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) continue;


// if the neighbor is visited continue to next neighbor


if(grid[nextRow][nextColumn]) continue;

// remove a wall from either verticals or horizontals

if(direction === 'left') {
    verticals[row][column-1] = true;
} else if(direction === 'right'){
    verticals[row][column] = true;
}else if(direction === 'up') {
    horizontals[row - 1][column] = true;
} else if(direction === 'down') horizontals[row][column] =true;

stepThroughCell(nextRow, nextColumn)

}

// visit that next cell




};

stepThroughCell(startRow, startColumn);
// console.log(grid);


horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open === true) return;
        

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                isStatic: true
            }

        );
        World.add(world, wall)
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if(open === true) return;
        

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            5,
            unitLength,
            {
                isStatic: true
            }

        );
        World.add(world, wall)
    })
})

const goal = Bodies.rectangle(
width - unitLength / 2,
height - unitLength / 2,
unitLength * .7,
unitLength * .7,
{
    isStatic: true
}
);
World.add(world, goal);


