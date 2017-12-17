/** ******************************************************************************************************************
 * @file Description of file here.
 * @author Julian Jensen <jjdanois@gmail.com>
 * @since 1.0.0
 * @date Sun Dec 10 2017
 *********************************************************************************************************************/
"use strict";

/**
 * @typedef {object} TraversalOptions
 * @property {Array<Array<number>>} [nodes]     - Optionally, you can put your array of nodes here
 * @property {number} [startIndex=0]            - Where to start, defaults to zero
 * @property {NodeWalkerCallback} [pre]         - Callback in pre-order
 * @property {NodeWalkerCallback} [post]        - Callback in post-order
 * @property {NodeWalkerCallback} [rpre]        - Callback in reverse pre-order
 * @property {NodeWalkerCallback} [rpost]       - Callback in reverse post-order
 * @property {EdgeCB} [edge]                    - Callback for every edge or each type, see `EdgeCB` below
 * @property {boolean} [spanningTree=true]      - A strongly connected graph with all nodes reachable from a common root
 * @property {boolean} [flat=false]             - Use an iterative walker, not recursive
 * @property {boolean} [excludeRoot=false]      - Do not invoke a callback for the root node
 * @property {boolean} [preOrder=true]          - Return an array of node indices in pre-order
 * @property {boolean} [postOrder=true]         - Return an array of node indices in post-order
 * @property {boolean} [rPreOrder=false]        - Return an array of node indices in reverse pre-order
 * @property {boolean} [rPostOrder=false]       - Return an array of node indices in reverse post-order
 * @property {boolean} [edges=true]             - Return edge information in the results object
 * @property {boolean} [trusted=false]          - Set `trusted` to `true` if you know your input is valid, i.e. an array where each element is either a number or an array of numbers.
 */

/**
 * You can define the edge field as a normal function and it will be called on each discovered edge with the
 * `from` and `to` node numbers, as well as the edge type. Alternatively, yuou can also just set the field to an object.
 *
 * The function or object can have four optional fields, one for each edge type. These will be called on the discovery
 * of their respective types. If you added these fields to a function, the main function will be called, in addition to these.
 *
 * @example
 * // For each backedge
 * DFS( nodes, {
 *     edge: { back: ( from, to ) => console.log( `back edge from ${from} to ${to}` )
 * // ... } );
 *
 * @example
 * // For all edges and one just for tree edges
 * function everyEdge( from, to, type )
 * {
 *     console.log( `Discovered ${type} edge from ${from} to ${to}` );
 * }
 *
 * everyEdge.tree = ( from, to ) => console.log( `Discovered a tree edge from ${from} to ${to}` );
 *
 * DFS( nodes, {
 *     edge: everyEdge
 * // ... } );
 *
 * @typedef {EdgeCallback|Object} EdgeCB
 * @property {EdgeTypeCallback} [tree]        - Callback for each tree edge
 * @property {EdgeTypeCallback} [forward]     - Callback for each forward edge (not applicable for BFS)
 * @property {EdgeTypeCallback} [back]        - Callback for each back edge
 * @property {EdgeTypeCallback} [cross]       - Callback for each cross edge
 */

/**
 * Edges are categorized by type. For a DFS, the type is one of "tree", "forward", "back", or "cross".
 * BFS graphs do not have forward edges so the type is limited to one of "tree", "forward", or "cross".
 *
 * @private
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
 * @property {DFSEdges} [edges]
 */

/**
 * @typedef {object} BFSTraversalResult
 * @property {Array<number>} [preOrder]
 * @property {Array<number>} [rPreOrder]
 * @property {Array<number>} [levels]
 * @property {BFSEdges} [edges]
 */

/**
 * @private
 * @typedef {object} DFSEdges
 * @property {Array<Edge>} tree
 * @property {Array<Edge>} forward
 * @property {Array<Edge>} back
 * @property {Array<Edge>} cross
 */

/**
 * @private
 * @typedef {object} BFSEdges
 * @property {Array<Edge>} tree
 * @property {Array<Edge>} back
 * @property {Array<Edge>} cross
 */

/**
 * @callback
 * @name SimpleWalkerCallback
 * @param {number} nodeIndex        - The index of the node input the input array
 * @param {number} orderedIndex     - The index into the ordered walk, goes from 0 to N - 1
 * @param {function(*=)} kill       - Return this or call it, with or without a value, to stop the walk
 */

/**
 * @callback
 * @name NodeWalkerCallback
 * @param {number} nodeIndex                - The index of the node in the original input array
 * @param {number} orderedIndex             - The sequence number of the node in order, goes 0 to N - 1
 * @param {Array<number>} orderedSequence   - The entire ordered sequence
 */

/**
 * @callback
 * @name EdgeTypeCallback
 * @property {number} from
 * @property {number} to
 */

/**
 * @callback
 * @name EdgeCallback
 * @param {number} from
 * @param {number} to
 * @param {string} type
 */

/**
 * @param {*} a
 * @return {boolean}
 * @ignore
 */
const
    isFn               = a => typeof a === 'function',
    { isArray: array } = Array,
    object             = o => typeof o === 'object' && !array( o ) && o !== null,
    defaultOptions     = { startIndex: 0, preOrder: true, postOrder: true, edges: true, spanningTree: true };


/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} postOrder
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 * @private
 */
function make_dfs_walker( list, preOrder, postOrder, add_edge, state )
{
    const
        preNumber = [],
        visit     = n => typeof state[ n ] === 'number' ? false : ( state[ n ] = 1 );

    /**
     * @param {number} u
     * @ignore
     */
    function __dfs( u )
    {
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
    }

    return u => {
        visit( u );
        return __dfs( u );
    };
}

/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} postOrder
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 * @private
 */
function make_flat_dfs_walker( list, preOrder, postOrder, add_edge, state )
{
    return start => {
        const
            parent = [],
            enter  = [],
            exit   = [],
            queue  = [];

        let time = 0;

        queue.push( [ start, null ] );
        preOrder.push( start );

        while ( queue.length )
        {
            const [ u, p ] = queue.pop();

            if ( u < 0 )
            {
                exit[ p ] = time++;
                postOrder.push( p );
                continue;
            }

            if ( !parent[ u ] && p !== null )
            {
                preOrder.push( u );
                parent[ u ] = p;
                add_edge( p, u, 'tree' );
            }
            else if ( p !== null )
                add_edge( p, u, 'forward' );

            if ( state[ u ] ) continue;

            enter[ u ] = time++;
            state[ u ] = true;

            queue.push( [ -u - 1, u ] );

            const children = list[ u ].slice().reverse();

            for ( const v of children )
            {
                if ( !state[ v ] )
                    queue.push( [ v, u ] );
                else
                {
                    if ( !exit[ u ] && !exit[ v ] )
                        add_edge( u, v, 'back' );
                    else    // else if ( !exit[ u ] )
                        add_edge( u, v, 'cross' );
                }
            }
        }
    };
}


/**
 * @param {Array<Array<number>>} list
 * @param {Array<number>} preOrder
 * @param {Array<number>} levels
 * @param {function(number, number, string):*} add_edge
 * @param {Array<number>} state
 * @return {function(number):*}
 * @private
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
     * @ignore
     */
    function classify( a, b )
    {
        let [ smaller, larger ] = levels[ a ] < levels[ b ] ? [ a, b ] : [ b, a ];

        while ( levels[ larger ] > levels[ smaller ] && smaller !== larger ) larger = parents[ larger ];

        return smaller === larger ? 'back' : 'cross';
    }

    /**
     * @param {number} s
     * @ignore
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
                    levels[ w ]  = levels[ v ] + 1;
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
 * A more involved traversal that's not as efficient as the simple walkers but provide more information.
 * You can use this to generate pre-order, post-order (and their reverses) sequences, as well as edge
 * information, all in a single pass.
 *
 * It does not provide levels which you need to get from the BFS traversal.
 *
 * @param {Array<Array<number>>|TraversalOptions} list
 * @param {TraversalOptions} [opts]
 * @return {DFSTraversalResult}
 */
function DFS( list, opts )
{
    return generic_walker( list, opts, object( opts ) && opts.flat ? make_flat_dfs_walker : make_dfs_walker, false );
}

/**
 * Much the same as the DFS function, it provides the same information and capabilities with a few exceptions.
 *
 * 1. It does not provide forward edge information.
 * 2. It does not generate a post-order walk.
 *
 * It does, however, provides levels.
 *
 * @param {Array<Array<number>>|TraversalOptions} list
 * @param {TraversalOptions} [opts]
 * @return {BFSTraversalResult}
 */
function BFS( list, opts )
{
    return generic_walker( list, opts, make_bfs_walker, true );
}

/**
 * @param {Array<Array<number>>|TraversalOptions} list
 * @param {TraversalOptions} [opts]
 * @param {function(number[][], number[], number[], function(number, number, string):*, number[]):function(number):*} _walker
 * @param {boolean} isBFS
 * @return {DFSTraversalResult|BFSTraversalResult}
 * @private
 */
function generic_walker( list, opts = defaultOptions, _walker, isBFS )
{
    if ( array( list ) && object( opts ) )
        opts.nodes = list;
    else if ( object( list ) )
        opts = Object.assign( defaultOptions, list );
    else
        opts = Object.assign( defaultOptions, { nodes: list, trusted: false } );

    list = opts.nodes;

    if ( typeof opts.startIndex !== 'number' || opts.startIndex < 0 ) opts.startIndex = 0;

    const
        numNodes = array( list ) && list.length;

    if ( !opts.trusted )
    {
        if ( !array( list ) ) throw new TypeError( `The list of nodes must be an array` );
        list            = list.map( e => array( e ) ? e : typeof e === 'number' ? [ e ] : [] );
        opts.startIndex = opts.startIndex % numNodes;
    }

    /**
     * @type {DFSTraversalResult|BFSTraversalResult}
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

    let currentRoot = opts.startIndex;

    const
        callback  = ( fn, ...args ) => isFn( fn ) && ( !opts.excludeRoot || args[ 0 ] !== currentRoot ) && fn( ...args ),

        add_edge  = ( from, to, type ) => {
            if ( opts.edges )
                r.edges[ type ].push( [ from, to ] );

            callback( opts.edge, from, to, type );
            callback( opts.edge && opts.edge[ type ], from, to );
        },
        pre       = ( n, i, a ) => callback( opts.pre, n, i, a ),
        post      = ( n, i, a ) => callback( opts.post, n, i, a ),
        rpre      = ( n, i, a ) => callback( opts.rpre, n, i, a ),
        rpost     = ( n, i, a ) => callback( opts.rpost, n, i, a ),

        postOrder = [],
        preOrder  = [],
        state     = [],
        walker    = _walker( list, preOrder, postOrder, add_edge, state );

    if ( opts.spanningTree )
        walker( opts.startIndex );
    else
    {
        let index = opts.startIndex,
            last  = index - 1;

        if ( last < 0 ) last = numNodes - 1;

        while ( index !== last )
        {
            if ( !state[ index ] ) walker( currentRoot = index );
            index = ( index + 1 ) % numNodes;
        }
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

/**
 * Call this with the node list and a callback function. If the graph does not start at index `0` then
 * add the actual start index as the third argument.
 *
 * @param {Array<Array<number>>} nodes
 * @param {SimpleWalkerCallback} fn
 * @param {number} [root=0]
 */
function preOrder( nodes, fn, root = 0 )
{
    if ( typeof fn !== 'function' )
        throw new TypeError( "The callback must be a function" );

    return prePostOrder( false, nodes, root, fn );
}

/**
 * Call this with the node list and a callback function. If the graph does not start at index `0` then
 * add the actual start index as the third argument.
 *
 * @param {Array<Array<number>>} nodes
 * @param {SimpleWalkerCallback} fn
 * @param {number} [root=0]
 */
function postOrder( nodes, fn, root = 0 )
{
    if ( typeof fn !== 'function' )
        throw new TypeError( "The callback must be a function" );

    return prePostOrder( true, nodes, root, fn );
}

/**
 * @param {boolean} isPost
 * @param {Array<Array<number>>} nodes
 * @param {number} root
 * @param {SimpleWalkerCallback} [cb]
 * @private
 */
function reverseOrder( isPost, nodes, root, cb )
{
    let _stop = false,
        rNode;

    const
        __stop = () => x => {
            _stop = true;
            if ( typeof x === 'number' ) rNode = x;
        },
        defer  = [];

    prePostOrder( isPost, nodes, root, n => defer.push( ( _fn, i ) => cb( rNode = n, i, _fn ) ) );

    let _,
        cnt = 0,
        n   = defer.length;

    for ( ; !_stop && n--; )
        _stop = defer[ n ]( _ = __stop(), cnt++ ) === _ || _stop;

    return rNode;
}

/**
 * Call this with the node list and a callback function. If the graph does not start at index `0` then
 * add the actual start index as the third argument.
 *
 * @param {Array<Array<number>>} nodes
 * @param {SimpleWalkerCallback} fn
 * @param {number} [root=0]
 */
function rPreOrder( nodes, fn, root = 0 )
{
    if ( typeof fn !== 'function' )
        throw new TypeError( "The callback must be a function" );


    return reverseOrder( false, nodes, root, fn );
}

/**
 * Call this with the node list and a callback function. If the graph does not start at index `0` then
 * add the actual start index as the third argument.
 *
 * @param {Array<Array<number>>} nodes
 * @param {SimpleWalkerCallback} fn
 * @param {number} [root=0]
 */
function rPostOrder( nodes, fn, root = 0 )
{
    if ( typeof fn !== 'function' )
        throw new TypeError( "The callback must be a function" );

    return reverseOrder( true, nodes, root, fn );
}

/**
 * @param {boolean} isPost
 * @param {Array<Array<number>>} nodes
 * @param {number} root
 * @param {SimpleWalkerCallback} [fn]
 * @private
 */
function prePostOrder( isPost, nodes, root, fn )
{
    let preNumber = 0,
        abort     = false,
        rNode;

    const
        isPre = !isPost,
        _v    = [];

    /**
     * @param {number} u
     * @ignore
     */
    function __dfs( u )
    {

        /** */
        function __abort( rn = u )
        {
            if ( abort !== true ) rNode = rn;
            return abort = true;
        }

        if ( isPre && ( fn( u, preNumber++, __abort ) === __abort || abort ) )
            return __abort( u );

        for ( const v of nodes[ u ] )
        {
            if ( _v[ v ] !== true )
            {
                _v[ v ] = true;
                if ( __dfs( v ) ) return true;
            }
        }

        if ( isPost && ( fn( u, preNumber++, __abort ) === __abort || abort ) )
            return __abort( u );
    }

    __dfs( root );

    return rNode;
}

module.exports = { DFS, BFS, preOrder, postOrder, rPreOrder, rPostOrder };
