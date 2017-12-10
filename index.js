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
 * Edges are categorized by type. For a DFS, the type is one of "tree", "forward", "back", or "cross".
 * BFS graphs do not have forward edges so the type is limited to one of "tree", "forward", or "cross".
 *
 * @typedef {object} Edge
 * @property {number} from
 * @property {number} to
 */

/**
 * @typedef {object} DFSTraversalResult
 * @property {Array<number>} [preOrder]
 * @property {Array<number>} [postOrder]
 * @property {Array<number>} [rPreOrder]
 * @property {Array<number>} [rPostOrder]
 * @property {DFSEdges|BFSEdges} [edges]
 */

/**
 * @typedef {object} BFSTraversalResult
 * @property {Array<number>} [preOrder]
 * @property {Array<number>} [rPreOrder]
 * @property {Array<number>} [levels]
 * @property {Array<Edge>} [edges]
 */

/**
 * @typedef {object} DFSEdges
 * @property {Array<Edge>} tree
 * @property {Array<Edge>} forward
 * @property {Array<Edge>} back
 * @property {Array<Edge>} cross
 */

/**
 * @typedef {object} BFSEdges
 * @property {Array<Edge>} tree
 * @property {Array<Edge>} back
 * @property {Array<Edge>} cross
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
    };
}

/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} levels
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 */
function make_bfs_walker( list, preOrder, levels, add_edge, state )
{
    const
        queue     = [],
        preNumber = [],
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

        preOrder.push( s );
        parents[ s ] = levels[ s ] = 0;

        while ( queue.length )
        {
            let v = queue.shift();

            list[ v ].forEach( w => {
                if ( typeof parents[ w ] !== 'number' )
                {
                    preNumber[ w ] = preOrder.length - 1;
                    preOrder.push( w );
                    state[ w ] = 2;

                    parents[ w ] = v;
                    levels[ w ] = levels[ v ] + 1;
                    add_edge( v, w, 'tree' );
                    queue.push( w );
                }
                else
                    add_edge( v, w, classify( v, w ) );
            } );
        }
    };
}


/**
 * @param {Array<Array<number>>|TraversalOptions} list
 * @param {TraversalOptions} [opts]
 * @return {DFSTraversalResult}
 */
function DFS( list, opts )
{
    return generic_walker( list, opts, make_dfs_walker, false );
}

/**
 * @param {Array<Array<number>>|TraversalOptions} list
 * @param {TraversalOptions} [opts]
 * @return {BFSTraversalResult}
 */
function BFS( list, opts )
{
    return generic_walker( list, opts, make_bfs_walker, true );
}

/**
 * @param {Array<Array<number>>} list
 * @param {TraversalOptions} [opts]
 * @param {function(number[][], number[], number[], function(number, number, string):*, number[]):function(number):*} _walker
 * @param {boolean} isBFS
 * @return {DFSTraversalResult|BFSTraversalResult}
 */
function generic_walker( list, opts = { nodes: [], startIndex: 0, preOrder: true, postOrder: true, edges: true }, _walker, isBFS )
{
    if ( array( list ) && object( opts ) )
        opts.nodes = list;
    else if ( object( list ) )
        opts = Object.assign( { nodes: [], startIndex: 0, preOrder: true, postOrder: true, edges: true }, list );

    list = opts.nodes;

    if ( typeof opts.startIndex !== 'number' || opts.startIndex < 0 ) opts.startIndex = 0;

    const
        numNodes = array( list ) && list.length;

    if ( !opts.trusted )
    {
        if ( !array( list ) ) throw new TypeError( `The list of nodes must be an array` );
        list = list.map( e => array( e ) ? e : typeof e === 'number' ? [ e ] : [] );
        opts.startIndex = opts.startIndex % numNodes;
    }

    /**
     * @type {TraversalResult}
     */
    const r = {};

    if ( opts.edges )
    {
        r.edges = {
            tree:    [],
            forward: [],
            back:    [],
            cross:   []
        };
    }

    const
        callback  = ( fn, ...args ) => isFn( fn ) && fn( ...args ),

        add_edge  = ( from, to, type ) => {
            if ( opts.edges )
                r.edges[ type ].push( [ from, to ] );

            callback( opts.edge, from, to, type );
            callback( opts.edge && opts.edge[ type ], from, to );
        },
        pre       = n => callback( opts.pre, n ),
        post      = n => callback( opts.post, n ),
        rpre      = n => callback( opts.rpre, n ),
        rpost     = n => callback( opts.rpost, n ),

        postOrder = [],
        preOrder  = [],
        state     = [],
        walker    = _walker( list, preOrder, postOrder, add_edge, state );

    let index = opts.startIndex,
        last  = index - 1;

    if ( last < 0 ) last = numNodes - 1;

    while ( index !== last )
    {
        if ( !state[ index ] ) walker( index );
        index = ( index + 1 ) % numNodes;
    }

    if ( opts.preOrder ) r.preOrder = preOrder;
    if ( !isBFS && opts.postOrder ) r.postOrder = postOrder;
    if ( opts.rPreOrder ) r.rPreOrder = preOrder.slice().reverse();
    if ( !isBFS && opts.rPostOrder ) r.rPostOrder = postOrder.slice().reverse();

    if ( opts.pre ) preOrder.forEach( pre );
    if ( !isBFS && opts.post ) postOrder.forEach( post );
    if ( opts.rpre ) ( r.rPreOrder || preOrder.slice().reverse() ).forEach( rpre );
    if ( !isBFS && opts.rpost ) ( r.rPostOrder || postOrder.slice().reverse() ).forEach( rpost );

    if ( isBFS ) r.levels = postOrder;

    return r;
}

module.exports = { DFS, BFS };