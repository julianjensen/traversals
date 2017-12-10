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
<dd></dd>
<dt><a href="#BFS">BFS(list, [opts])</a> ⇒ <code><a href="#BFSTraversalResult">BFSTraversalResult</a></code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#EdgeCB">EdgeCB</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#TraversalOptions">TraversalOptions</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#Edge">Edge</a> : <code>object</code></dt>
<dd><p>Edges are categorized by type. For a DFS, the type is one of &quot;tree&quot;, &quot;forward&quot;, &quot;back&quot;, or &quot;cross&quot;.
BFS graphs do not have forward edges so the type is limited to one of &quot;tree&quot;, &quot;forward&quot;, or &quot;cross&quot;.</p>
</dd>
<dt><a href="#DFSTraversalResult">DFSTraversalResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BFSTraversalResult">BFSTraversalResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DFSEdges">DFSEdges</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#BFSEdges">BFSEdges</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="DFS"></a>

## DFS(list, [opts]) ⇒ [<code>DFSTraversalResult</code>](tmp.md#DFSTraversalResult)
**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> \| [<code>TraversalOptions</code>](tmp.md#TraversalOptions) | 
| [opts] | [<code>TraversalOptions</code>](tmp.md#TraversalOptions) | 

<a name="BFS"></a>

## BFS(list, [opts]) ⇒ [<code>BFSTraversalResult</code>](tmp.md#BFSTraversalResult)
**Kind**: global function  

| Param | Type |
| --- | --- |
| list | <code>Array.&lt;Array.&lt;number&gt;&gt;</code> \| [<code>TraversalOptions</code>](tmp.md#TraversalOptions) | 
| [opts] | [<code>TraversalOptions</code>](tmp.md#TraversalOptions) | 

<a name="EdgeCB"></a>

## EdgeCB : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| tree | <code>function</code> | 
| forward | <code>function</code> | 
| back | <code>function</code> | 
| cross | <code>function</code> | 

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
| edge | <code>function</code>\|<code>EdgeCB</code> |  | Callback for every edge |
| spanningTree | <code>boolean</code> | <code>true</code> | A strongly connected graph with all nodes reachable from a common root |
| preOrder | <code>boolean</code> | <code>true</code> | Return an array of node indices in pre-order |
| postOrder | <code>boolean</code> | <code>true</code> | Return an array of node indices in post-order |
| rPreOrder | <code>boolean</code> | <code>false</code> | Return an array of node indices in reverse pre-order |
| rPostOrder | <code>boolean</code> | <code>false</code> | Return an array of node indices in reverse post-order |
| edges | <code>boolean</code> | <code>true</code> | Return edge information in the results object |
| trusted | <code>boolean</code> | <code>false</code> | Set `trusted` to `true` if you know your input is valid, i.e. an array where each element is either a number or an array of numbers. |

<a name="Edge"></a>

## Edge : <code>object</code>
Edges are categorized by type. For a DFS, the type is one of "tree", "forward", "back", or "cross".
BFS graphs do not have forward edges so the type is limited to one of "tree", "forward", or "cross".

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| from | <code>number</code> | 
| to | <code>number</code> | 

<a name="DFSTraversalResult"></a>

## DFSTraversalResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| preOrder | <code>Array&lt;number&gt;</code> | 
| postOrder | <code>Array&lt;number&gt;</code> | 
| rPreOrder | <code>Array&lt;number&gt;</code> | 
| rPostOrder | <code>Array&lt;number&gt;</code> | 
| edges | [<code>DFSEdges</code>](tmp.md#DFSEdges) | 

<a name="BFSTraversalResult"></a>

## BFSTraversalResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| preOrder | <code>Array.&lt;number&gt;</code> | 
| rPreOrder | <code>Array.&lt;number&gt;</code> | 
| levels | <code>Array.&lt;number&gt;</code> | 
| edges | [<code>BFSEdges</code>](tmp.md#BFSEdges) | 

<a name="DFSEdges"></a>

## DFSEdges : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| tree | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 
| forward | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 
| back | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 
| cross | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 

<a name="BFSEdges"></a>

## BFSEdges : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| tree | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 
| back | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 
| cross | [<code>Array&lt;Edge&gt;</code>](tmp.md#Edge) | 



## License

MIT © [Julian Jensen](https://github.com/julianjensen/traversals)


[coveralls-url]: https://coveralls.io/github/julianjensen/traversals?branch=master
[coveralls-image]: https://coveralls.io/repos/github/julianjensen/traversals/badge.svg?branch=master

[travis-url]: https://travis-ci.org/julianjensen/traversals
[travis-image]: http://img.shields.io/travis/julianjensen/traversals.svg

[depstat-url]: https://gemnasium.com/github.com/julianjensen/traversals
[depstat-image]: https://gemnasium.com/badges/github.com/julianjensen/traversals.svg

[npm-url]: https://badge.fury.io/js/traversals
[npm-image]: https://badge.fury.io/js/traversals.svg

[license-url]: https://github.com/julianjensen/dominators/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg

[snyk-url]: https://snyk.io/test/github/julianjensen/traversals
[snyk-image]: https://snyk.io/test/github/julianjensen/traversals/badge.svg

[david-dm-url]: https://david-dm.org/julianjensen/traversals
[david-dm-image]: https://david-dm.org/julianjensen/traversals.svg
