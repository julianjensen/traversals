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

For quick and easy traversals, when you just want to be called in once per node in a particular order, you can use the function shown below. The following shows various uses of the pre-order walk. The other three walks work in an identical manner.

```js
const
    { preOrder } = require( 'traversals' ); // The other 3 functions
                                                // are: postOrder, 
                                                // rPreOrdder, and
                                                // rPostOrder

// For all of these walks, you can abort it at any stage by returning
// or calling the third argument. In the first example, however, we
// just run allthe way through.

preOrder( testGraph, ( nodeNum, preNum ) => {
    // preNum just goes from 0 to N - 1
    console.log( `Node index: ${nodeNum}, pre-order index: ${preNum}` );
} );

// In this case, we stop the walk and return a result, in this case, the
// returnValue will be 3
let returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
    console.log( `Node index: ${nodeNum}, pre-order index: ${preNum}` );
    // Return kill to stop the walk, here we stop on node index 3
    return nodeNum === 3 && kill;
} );

const preSeq = [];

// Return value here will be 4
returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
    // Create a list of node indices in pre-order
    preSeq.push( nodeNum );
    // When we reach node index 4, call kill to stop the walk
    nodeNum === 4 && kill();
}, 0 );

let prev, 
    nodeJustBeforeThis = 3;

// Here we stop the walk with an arbitrary value of our own choosing
// again by calling the kill function with the value.
returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
    nodeNum === nodeJustBeforeThis && kill( prev );
    prev = nodeNum;
} );

```

## API

## Functions

<dl>
<dt><a href="#DFS">DFS(list, [opts])</a> ⇒ <code><a href="#DFSTraversalResult">DFSTraversalResult</a></code></dt>
<dd><p>A more involved traversal that&#39;s not as efficient as the simple walkers but provide more information.
You can use this to generate pre-order, post-order (and their reverses) sequences, as well as edge
information, all in a single pass.</p>
<p>It does not provide levels which you need to get from the BFS traversal.</p>
</dd>
<dt><a href="#BFS">BFS(list, [opts])</a> ⇒ <code><a href="#BFSTraversalResult">BFSTraversalResult</a></code></dt>
<dd><p>Much the same as the DFS function, it provides the same information and capabilities with a few exceptions.</p>
<ol>
<li>It does not provide forward edge information.</li>
<li>It does not generate a post-order walk.</li>
</ol>
<p>It does, however, provides levels.</p>
</dd>
<dt><a href="#preOrder">preOrder(nodes, fn, [root])</a></dt>
<dd><p>Call this with the node list and a callback function. If the graph does not start at index <code>0</code> then
add the actual start index as the third argument.</p>
</dd>
<dt><a href="#postOrder">postOrder(nodes, fn, [root])</a></dt>
<dd><p>Call this with the node list and a callback function. If the graph does not start at index <code>0</code> then
add the actual start index as the third argument.</p>
</dd>
<dt><a href="#rPreOrder">rPreOrder(nodes, fn, [root])</a></dt>
<dd><p>Call this with the node list and a callback function. If the graph does not start at index <code>0</code> then
add the actual start index as the third argument.</p>
</dd>
<dt><a href="#rPostOrder">rPostOrder(nodes, fn, [root])</a></dt>
<dd><p>Call this with the node list and a callback function. If the graph does not start at index <code>0</code> then
add the actual start index as the third argument.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TraversalOptions">TraversalOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#EdgeCB">EdgeCB</a> : <code><a href="#EdgeCallback">EdgeCallback</a></code> | <code>Object</code></dt>
<dd><p>You can define the edge field as a normal function and it will be called on each discovered edge with the
<code>from</code> and <code>to</code> node numbers, as well as the edge type. Alternatively, yuou can also just set the field to an object.</p>
<p>The function or object can have four optional fields, one for each edge type. These will be called on the discovery
of their respective types. If you added these fields to a function, the main function will be called, in addition to these.</p>
</dd>
<dt><a href="#DFSTraversalResult">DFSTraversalResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BFSTraversalResult">BFSTraversalResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SimpleWalkerCallback">SimpleWalkerCallback</a></dt>
<dd></dd>
<dt><a href="#NodeWalkerCallback">NodeWalkerCallback</a></dt>
<dd></dd>
<dt><a href="#EdgeTypeCallback">EdgeTypeCallback</a></dt>
<dd></dd>
<dt><a href="#EdgeCallback">EdgeCallback</a></dt>
<dd></dd>
</dl>

<a name="DFS"></a>

## DFS(list, [opts]) ⇒ [<code>DFSTraversalResult</code>](#DFSTraversalResult)
A more involved traversal that's not as efficient as the simple walkers but provide more information.
You can use this to generate pre-order, post-order (and their reverses) sequences, as well as edge
information, all in a single pass.

It does not provide levels which you need to get from the BFS traversal.

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> \| [<code>TraversalOptions</code>](#TraversalOptions) | 
| [opts] | [<code>TraversalOptions</code>](#TraversalOptions) | 

<a name="BFS"></a>

## BFS(list, [opts]) ⇒ [<code>BFSTraversalResult</code>](#BFSTraversalResult)
Much the same as the DFS function, it provides the same information and capabilities with a few exceptions.

1. It does not provide forward edge information.
2. It does not generate a post-order walk.

It does, however, provides levels.

**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> \| [<code>TraversalOptions</code>](#TraversalOptions) | 
| [opts] | [<code>TraversalOptions</code>](#TraversalOptions) | 

<a name="preOrder"></a>

## preOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | [<code>SimpleWalkerCallback</code>](#SimpleWalkerCallback) |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="postOrder"></a>

## postOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | [<code>SimpleWalkerCallback</code>](#SimpleWalkerCallback) |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="rPreOrder"></a>

## rPreOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | [<code>SimpleWalkerCallback</code>](#SimpleWalkerCallback) |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="rPostOrder"></a>

## rPostOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | [<code>SimpleWalkerCallback</code>](#SimpleWalkerCallback) |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="TraversalOptions"></a>

## TraversalOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | Optionally, you can put your array of nodes here |
| startIndex | <code>number</code> | <code>0</code> | Where to start, defaults to zero |
| pre | [<code>NodeWalkerCallback</code>](#NodeWalkerCallback) |  | Callback in pre-order |
| post | [<code>NodeWalkerCallback</code>](#NodeWalkerCallback) |  | Callback in post-order |
| rpre | [<code>NodeWalkerCallback</code>](#NodeWalkerCallback) |  | Callback in reverse pre-order |
| rpost | [<code>NodeWalkerCallback</code>](#NodeWalkerCallback) |  | Callback in reverse post-order |
| edge | [<code>EdgeCB</code>](#EdgeCB) |  | Callback for every edge or each type, see `EdgeCB` below |
| spanningTree | <code>boolean</code> | <code>true</code> | A strongly connected graph with all nodes reachable from a common root |
| flat | <code>boolean</code> | <code>false</code> | Use an iterative walker, not recursive |
| excludeRoot | <code>boolean</code> | <code>false</code> | Do not invoke a callback for the root node |
| preOrder | <code>boolean</code> | <code>true</code> | Return an array of node indices in pre-order |
| postOrder | <code>boolean</code> | <code>true</code> | Return an array of node indices in post-order |
| rPreOrder | <code>boolean</code> | <code>false</code> | Return an array of node indices in reverse pre-order |
| rPostOrder | <code>boolean</code> | <code>false</code> | Return an array of node indices in reverse post-order |
| edges | <code>boolean</code> | <code>true</code> | Return edge information in the results object |
| trusted | <code>boolean</code> | <code>false</code> | Set `trusted` to `true` if you know your input is valid, i.e. an array where each element is either a number or an array of numbers. |

<a name="EdgeCB"></a>

## EdgeCB : [<code>EdgeCallback</code>](#EdgeCallback) \| <code>Object</code>
You can define the edge field as a normal function and it will be called on each discovered edge with the
`from` and `to` node numbers, as well as the edge type. Alternatively, yuou can also just set the field to an object.

The function or object can have four optional fields, one for each edge type. These will be called on the discovery
of their respective types. If you added these fields to a function, the main function will be called, in addition to these.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tree | [<code>EdgeTypeCallback</code>](#EdgeTypeCallback) | Callback for each tree edge |
| forward | [<code>EdgeTypeCallback</code>](#EdgeTypeCallback) | Callback for each forward edge (not applicable for BFS) |
| back | [<code>EdgeTypeCallback</code>](#EdgeTypeCallback) | Callback for each back edge |
| cross | [<code>EdgeTypeCallback</code>](#EdgeTypeCallback) | Callback for each cross edge |

**Example**  
```js
// For each backedge
DFS( nodes, {
    edge: { back: ( from, to ) => console.log( `back edge from ${from} to ${to}` )
    // ...
} );
```
**Example**  
```js
// For all edges and one just for tree edges
function everyEdge( from, to, type )
{
    console.log( `Discovered ${type} edge from ${from} to ${to}` );
}

everyEdge.tree = ( from, to ) => console.log( `Discovered a tree edge from ${from} to ${to}` );

DFS( nodes, {
    edge: everyEdge
    // ...
} );
```
<a name="DFSTraversalResult"></a>

## DFSTraversalResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| preOrder | <code>Array.&lt;number&gt;</code> | 
| postOrder | <code>Array.&lt;number&gt;</code> | 
| rPreOrder | <code>Array.&lt;number&gt;</code> | 
| rPostOrder | <code>Array.&lt;number&gt;</code> | 
| edges | <code>DFSEdges</code> | 

<a name="BFSTraversalResult"></a>

## BFSTraversalResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| preOrder | <code>Array.&lt;number&gt;</code> | 
| rPreOrder | <code>Array.&lt;number&gt;</code> | 
| levels | <code>Array.&lt;number&gt;</code> | 
| edges | <code>BFSEdges</code> | 

<a name="SimpleWalkerCallback"></a>

## SimpleWalkerCallback
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| nodeIndex | <code>number</code> | The index of the node input the input array |
| orderedIndex | <code>number</code> | The index into the ordered walk, goes from 0 to N - 1 |
| kill | <code>function</code> | Return this or call it, with or without a value, to stop the walk |

<a name="NodeWalkerCallback"></a>

## NodeWalkerCallback
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| nodeIndex | <code>number</code> | The index of the node in the original input array |
| orderedIndex | <code>number</code> | The sequence number of the node in order, goes 0 to N - 1 |
| orderedSequence | <code>Array.&lt;number&gt;</code> | The entire ordered sequence |

<a name="EdgeTypeCallback"></a>

## EdgeTypeCallback
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| from | <code>number</code> | 
| to | <code>number</code> | 

<a name="EdgeCallback"></a>

## EdgeCallback
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| from | <code>number</code> | 
| to | <code>number</code> | 
| type | <code>string</code> | 

[coveralls-url]: https://coveralls.io/github/julianjensen/traversals?branch=master
[coveralls-image]: https://coveralls.io/repos/github/julianjensen/traversals/badge.svg?branch=master

[travis-url]: https://travis-ci.org/julianjensen/traversals
[travis-image]: http://img.shields.io/travis/julianjensen/traversals.svg

[depstat-url]: https://gemnasium.com/github.com/julianjensen/traversals
[depstat-image]: https://gemnasium.com/badges/github.com/julianjensen/traversals.svg

[npm-url]: https://badge.fury.io/js/traversals
[npm-image]: https://badge.fury.io/js/traversals.svg

[license-url]: https://github.com/julianjensen/traversals/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg

[snyk-url]: https://snyk.io/test/github/julianjensen/traversals
[snyk-image]: https://snyk.io/test/github/julianjensen/traversals/badge.svg

[david-dm-url]: https://david-dm.org/julianjensen/traversals
[david-dm-image]: https://david-dm.org/julianjensen/traversals.svg

