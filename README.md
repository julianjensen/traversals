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
<dt><a href="#EdgeCB">EdgeCB</a> : <code>function</code></dt>
<dd><p>You can define the edge field as a normal function and it will be called on each discovered edge with the
<code>from</code> and <code>to</code> node numbers, as well as the edge type. Alternatively, yuou can also just set the field to an object.</p>
<p>The function or object can have four optional fields, one for each edge type. These will be called on the discovery
of their respective types. If you added these fields to a function, the main function will be called, in addition to these.</p>
</dd>
<dt><a href="#DFSTraversalResult">DFSTraversalResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BFSTraversalResult">BFSTraversalResult</a> : <code>object</code></dt>
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
| fn | <code>function</code> |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="postOrder"></a>

## postOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | <code>function</code> |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="rPreOrder"></a>

## rPreOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | <code>function</code> |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="rPostOrder"></a>

## rPostOrder(nodes, fn, [root])
Call this with the node list and a callback function. If the graph does not start at index `0` then
add the actual start index as the third argument.

**Kind**: global function  

| Param | Type | Default |
| --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | 
| fn | <code>function</code> |  | 
| [root] | <code>number</code> | <code>0</code> | 

<a name="TraversalOptions"></a>

## TraversalOptions : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| nodes | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> |  | Optionally, you can put your array of nodes here |
| startIndex | <code>number</code> | <code>0</code> | Where to start, defaults to zero |
| pre | <code>function</code> |  | Callback in pre-order |
| post | <code>function</code> |  | Callback in post-order |
| rpre | <code>function</code> |  | Callback in reverse pre-order |
| rpost | <code>function</code> |  | Callback in reverse post-order |
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

## EdgeCB : <code>function</code>
You can define the edge field as a normal function and it will be called on each discovered edge with the
`from` and `to` node numbers, as well as the edge type. Alternatively, yuou can also just set the field to an object.

The function or object can have four optional fields, one for each edge type. These will be called on the discovery
of their respective types. If you added these fields to a function, the main function will be called, in addition to these.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tree | <code>function</code> | Callback for each tree edge |
| forward | <code>function</code> | Callback for each forward edge (not applicable for BFS) |
| back | <code>function</code> | Callback for each back edge |
| cross | <code>function</code> | Callback for each cross edge |

**Example**  
```js
// For each backedge
DFS( nodes, {
    edge: { back: ( from, to ) => console.log( `back edge from ${from} to ${to}` )
// ... } );
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
// ... } );
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

