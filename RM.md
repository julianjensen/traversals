# traversals

[![Coveralls Status][coveralls-image]][coveralls-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][depstat-image]][depstat-url]
[![npm version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![david-dm][david-dm-image]][david-dm-url]


> Small module for graph traversals, supporting DFS and BFS with niceties added for pre- and post-order, including their reverses.


## Install

```sh
npm i traversals
```

## Usage

```js
const 
    { DFS, BFS } = require( 'traversals' ),
    someGraph = testGraph          = [
                        [ 1, 8 ],    // start
                        [ 2, 3 ],    // a
                        [ 3 ],       // b
                        [ 4, 5 ],    // c
                        [ 6 ],       // d
                        [ 6 ],       // e
                        [ 7, 2 ],    // f
                        [ 8 ],       // g
                        []           // end
                    ];

const { preOrder, postOrder } = DFS( someGraph );

// Output the nodes in pre-order
preOrder.forEach( pre => console.log( `We saw node at index ${pre}` ) );

// ...alternatively, use a callbacks. You can use some, all, or none of these.

function record_any_edge( from, to, type )
{
    console.log( `We have an edge from ${from} to ${to} with type "${type}"` );
}

// Use the function as an object. Normally, you would need these
// individually typed callbacks. But, for the sake of completeness...
record_any_edge.tree = ( from, to ) => console.log( `tree edge from ${from} to ${to}` ); 
record_any_edge.forward = ( from, to ) => console.log( `forward edge from ${from} to ${to}` ); 
record_any_edge.back = ( from, to ) => console.log( `back edge from ${from} to ${to}` ); 
record_any_edge.cross = ( from, to ) => console.log( `cross edge from ${from} to ${to}` ); 

DFS( someGraph, { 
    pre( n ) { console.log( `pre-order: ${n}` ); }, 
    post( n ) { console.log( `post-order: ${n}` ); }, 
    rpre( n ) { console.log( `reverse pre-order: ${n}` ); }, 
    rpost( n ) { console.log( `reverse post-order: ${n}` ); },
    edge: record_any_edge
} );

// Or, if you just wanted, say, tree edges...

DFS( someGraph, { edge: { tree: ( from, to ) => console.log( `tree from ${from} to ${to}` ) } } );

// The BFS is much the same, except you get levels back but no post-order. Both have pre-order.
// BFS also has no forward edges.
```

## API
