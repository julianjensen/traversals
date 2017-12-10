/** ******************************************************************************************************************
 * @file Description of file here.
 * @author Julian Jensen <jjdanois@gmail.com>
 * @since 1.0.0
 * @date Sun Dec 10 2017
 *********************************************************************************************************************/
"use strict";

/**
 * @typedef {object} EdgeCB
 * @property {function(number, number):*} [tree]
 * @property {function(number, number):*} [forward]
 * @property {function(number, number):*} [back]
 * @property {function(number, number):*} [cross]
 */

/**
 * @typedef {object} TraversalOptions
 * @property {Array<Array<number>>} nodes
 * @property {number} [startIndex=0]
 * @property {function(number):boolean} [pre]
 * @property {function(number):boolean} [post]
 * @property {function(number):boolean} [rpre]
 * @property {function(number):boolean} [rpost]
 * @property {function(number, number, string):*|EdgeCB} [edge]
 * @property {boolean} [preOrder=true]
 * @property {boolean} [postOrder=true]
 * @property {boolean} [rPreOrder=false]
 * @property {boolean} [rPostOrder=false]
 * @property {boolean} [edges=true]
 * @property {boolean} [trusted=false]      - Set `trusted` to `true` if you know your input is valid, i.e. an array where each element is either a number or an array of numbers.
 */

/**
 * @typedef {object} Edge
 * @property {number} from
 * @property {number} to
 * @property {string} type      - One of "tree", "forward", "back", or "cross"
 */

/**
 * @typedef {object} TraversalResult
 * @property {Array<number>} [preOrder]
 * @property {Array<number>} [postOrder]
 * @property {Array<number>} [rPreOrder]
 * @property {Array<number>} [rPostOrder]
 * @property {Array<Edge>} [edges]
 */

/**
 * @param {*} a
 * @return {boolean}
 */
const
    isFn               = a => typeof a === 'function',
    { isArray: array } = Array,
    object             = o => typeof o === 'object' && !array( o ) && o !== null;


/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} postOrder
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 */
function make_dfs_walker( list, preOrder, postOrder, add_edge, state )
{
    const
        preNumber = [],
        visit     = n => typeof state[ n ] === 'number' ? false : ( state[ n ] = 1 );

    /**
     * @param {number} u
     */
    return function __dfs( u ) {
        preNumber[ u ] = preOrder.length;
        preOrder.push( u );

        for ( const v of list[ u ] )
        {
            if ( visit( v ) )
            {
                add_edge( u, v, 'tree' );
                __dfs( v );
            }
            else if ( state[ v ] === 1 )
                add_edge( u, v, 'back' );
            else if ( preNumber[ u ] < preNumber[ v ] )
                add_edge( u, v, 'forward' );
            else
                add_edge( u, v, 'cross' );
        }

        state[ u ] = 2;
        postOrder.push( u );
        // rPostOrder.push( rpostCnt-- );
    };
}

/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} postOrder
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 */
function make_bfs_walker( list, preOrder, postOrder, add_edge, state )
{
    const
        preNumber = [],
        levels    = [],
        queue     = [],
        parents   = [];

    /**
     * @param {number} a
     * @param {number} b
     * @return {string}
     */
    function classify( a, b )
    {
        let [ smaller, larger ] = levels[ a ] < levels[ b ] ? [ a, b ] : [ b, a ];

        while ( levels[ larger ] > levels[ smaller ] && smaller !== larger ) larger = parents[ larger ];

        return smaller === larger ? 'back' : 'cross';
    }

    /**
     * @param {number} u
     */
    return function __bfs( s ) {
        queue.push( s );

        let v;

        parents[ s ] = -1;
        levels[ s ] = 0;

        while ( ( v = queue.shift() ) )
        {
            if ( v < 0 )
                postOrder.push( -v );
            else
            {
                preNumber[ v ] = preOrder.length;
                preOrder.push( v );
                state[ v ] = 2;

                list[ v ].forEach( w => {
                    if ( typeof parents[ w ] !== 'number' )
                    {
                        parents[ w ] = v;
                        levels[ w ] = levels[ v ] + 1;
                        add_edge( v, w, 'tree' );
                        queue.push( w );
                    }
                    else
                        add_edge( v, w, classify( v, w ) );
                } );

                queue.push( -v );
            }
        }
    };
}


/**
 * @param {Array<Array<number>>} list
 * @param {TraversalOptions} [opts]
 * @return {TraversalResult}
 */
function DFS( list, opts )
{
    return generic_walker( list, opts, make_dfs_walker );
}

/**
 * @param {Array<Array<number>>} list
 * @param {TraversalOptions} [opts]
 * @return {TraversalResult}
 */
function BFS( list, opts )
{
    return generic_walker( list, opts, make_bfs_walker );
}

/**
 * @param {Array<Array<number>>} list
 * @param {TraversalOptions} [opts]
 * @param {function(number[][], number[], number[], function(number, number, string):*, number[]):function(number):*} _walker
 * @return {TraversalResult}
 */
function generic_walker( list, opts = { nodes: [], startIndex: 0, preOrder: true, postOrder: true, edges: true }, _walker )
{
    if ( array( list ) && object( opts ) )
        opts.nodes = list;
    else if ( object( list ) )
        opts = Object.assign( { nodes: [], startIndex: 0, preOrder: true, postOrder: true, edges: true }, list );

    list = opts.nodes;

    if ( typeof opts.startIndex !== 'number' ) opts.startIndex = 0;

    const
        numNodes = list.length;

    if ( !opts.trusted )
    {
        if ( !array( list ) ) throw new TypeError( `The list of nodes must be an array` );
        list = list.map( e => array( e ) ? e : typeof e === 'number' ? [ e ] : [] );
        opts.startIndex = opts.startIndex % numNodes;
        if ( opts.startIndex < 0 ) opts.startIndex = numNodes + opts.startIndex;
    }

    const
        callback   = ( fn, ...args ) => isFn( fn ) && fn( ...args ),

        add_edge   = ( from, to, type ) => {
            callback( opts.edge, from, to, type );
            callback( opts.edge && opts.edge[ type ], from, to );
        },
        pre        = n => callback( opts.pre, n ),
        post       = n => callback( opts.post, n ),
        rpre       = n => callback( opts.rpre, n ),
        rpost      = n => callback( opts.rpost, n ),

        postOrder  = [],
        preOrder   = [],
        state      = [],
        walker     = _walker( list, preOrder, postOrder, add_edge, state );

    let index = opts.startIndex,
        last  = index - 1;

    if ( last < 0 ) last = numNodes - 1;

    while ( index !== last )
    {
        if ( !state[ index ] ) walker( index );
        index = ( index + 1 ) % numNodes;
    }

    /**
     * @type {TraversalResult}
     */
    const r = {};

    if ( opts.preOrder ) r.preOrder = preOrder;
    if ( opts.postOrder ) r.postOrder = postOrder;
    if ( opts.rPreOrder ) r.rPreOrder = preOrder.slice().reverse();
    if ( opts.rPostOrder ) r.rPostOrder = postOrder.slice().reverse();

    if ( opts.pre ) preOrder.forEach( pre );
    if ( opts.post ) postOrder.forEach( post );
    if ( opts.rpre ) ( r.rPreOrder || preOrder.slice().reverse() ).forEach( rpre );
    if ( opts.rpost ) ( r.rPostOrder || postOrder.slice().reverse() ).forEach( rpost );

    return r;
}

module.exports = { DFS, BFS };

const slide = [
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
//
// const result = DFS( slide );
//
// const fancy = `          ┌─────────┐
// ┌─────────┤ START 0 │
// │         └────┬────┘
// │              │
// │              V
// │            ┌───┐
// │     ┌──────┤ 1 │
// │     │      └─┬─┘
// │     │        │
// │     │        V
// │     │      ┌───┐
// │     │      │ 2 │<───────────┐
// │     │      └─┬─┘            │
// │     │        │              │
// │     │        V              │
// │     │      ┌───┐            │
// │     └─────>│   │            │
// │     ┌──────┤ 3 ├──────┐     │
// │     │      └───┘      │     │
// │     │                 │     │
// │     V                 V     │
// │   ┌───┐             ┌───┐   │
// │   │ 4 │             │ 5 │   │
// │   └─┬─┘             └─┬─┘   │
// │     │                 │     │
// │     │                 │     │
// │     │      ┌───┐      │     │
// │     └─────>│ 6 │<─────┘     │
// │            │   ├────────────┘
// │            └─┬─┘
// │              │
// │              V
// │            ┌───┐
// │            │ 7 │
// │            └─┬─┘
// │              │
// │              V
// │         ┌─────────┐
// └────────>│  EXIT 8 │
//           └─────────┘
// `;
//
// // console.log( fancy.replace( /(\d+)/g, ( $0, $1 ) => Number( $1 ) + 1 ) );
// // console.log( 'preOrder:', result.preOrder.map( i => i + 1 ) );
// // console.log( 'postOrder:', result.postOrder.map( i => i + 1 ) );
//
// // console.log( 'result:', result );
//
DFS( slide, { preOrder: false, postOrder: false, rPreOrder: true, rPostOrder: true } );
