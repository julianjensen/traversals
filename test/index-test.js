/** ******************************************************************************************************************
 * @file Unit tests for many things, not all, but 100% coverage.
 * @author Julian Jensen <jjdanois@gmail.com>
 * @since 1.0.0
 * @date Sun Dec 10 2017
 *********************************************************************************************************************/
"use strict";

const
    testGraphVisual    = `          ┌─────────┐
┌─────────┤ START 0 │
│         └────┬────┘
│              │
│              V
│            ┌───┐
│     ┌──────┤ 1 │
│     │      └─┬─┘
│     │        │
│     │        V
│     │      ┌───┐
│     │      │ 2 │<───────────┐
│     │      └─┬─┘            │
│     │        │              │
│     │        V              │
│     │      ┌───┐            │
│     └─────>│   │            │
│     ┌──────┤ 3 ├──────┐     │
│     │      └───┘      │     │
│     │                 │     │
│     V                 V     │
│   ┌───┐             ┌───┐   │
│   │ 4 │             │ 5 │   │
│   └─┬─┘             └─┬─┘   │
│     │                 │     │
│     │                 │     │
│     │      ┌───┐      │     │
│     └─────>│ 6 │<─────┘     │
│            │   ├────────────┘
│            └─┬─┘
│              │
│              V
│            ┌───┐
│            │ 7 │
│            └─┬─┘
│              │
│              V
│         ┌─────────┐
└────────>│  EXIT 8 │
          └─────────┘
`,
    expect             = require( 'chai' ).expect,
    {
        DFS,
        BFS,
        preOrder,
        postOrder,
        rPreOrder,
        rPostOrder
    }                  = require( '../index' ),
    testGraph          = [
        [ 1, 8 ],    // start
        [ 2, 3 ],    // a
        [ 3 ],       // b
        [ 4, 5 ],    // c
        [ 6 ],       // d
        [ 6 ],       // e
        [ 7, 2 ],    // f
        [ 8 ],       // g
        []           // end
    ],
    irregularTestGraph = [
        [ 1, 8 ],    // start
        [ 2, 3 ],    // a
        3,       // b
        [ 4, 5 ],    // c
        6,       // d
        6,       // e
        [ 7, 2 ],    // f
        [ 8 ],       // g
        void 0           // end
    ],
    bfsBackedge        = [
        [ 1, 8 ],    // start
        [ 2, 3 ],    // a
        [ 3 ],       // b
        [ 4, 5 ],    // c
        [ 6 ],       // d
        [ 6 ],       // e
        [ 4, 7, 2 ], // f
        [ 8 ],       // g
        []           // end
    ],
    correctPreOrder    = [ 0, 1, 2, 3, 4, 6, 7, 8, 5 ],
    correctPostOrder   = [ 8, 7, 6, 4, 5, 3, 2, 1, 0 ],
    incSeq             = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];


describe( 'traversals', function() {

    console.log( testGraphVisual );

    describe( 'DFS', function() {
        it( 'traverse a graph without callbacks', () => {
            const
                result = DFS( testGraph );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( correctPreOrder );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
        } );

        it( 'traverse a graph without callbacks without recursion', () => {
            const
                result = DFS( testGraph, { preOrder: true, postOrder: true, edges: true, flat: true } );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( correctPreOrder );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
            expect( result.edges ).to.be.an( 'object' );
            expect( result.edges.tree ).to.be.an( 'array' );
            expect( result.edges.back ).to.be.an( 'array' );
            expect( result.edges.forward ).to.be.an( 'array' );
            expect( result.edges.cross ).to.be.an( 'array' );

            const { tree, back, forward, cross } = result.edges;

            expect( tree ).to.eql( [
                [ 0, 1 ],
                [ 1, 2 ],
                [ 2, 3 ],
                [ 3, 4 ],
                [ 4, 6 ],
                [ 6, 7 ],
                [ 7, 8 ],
                [ 3, 5 ]
            ] );
            expect( back ).to.eql( [ [ 6, 2 ] ] );
            expect( forward ).to.eql( [ [ 1, 3 ], [ 0, 8 ] ] );
            expect( cross ).to.eql( [ [ 5, 6 ] ] );

        } );

        it( 'should expect an array for the graph argument', () => {
            expect( DFS.bind( null, 'hello' ) ).to.throw;
            expect( DFS.bind( null ) ).to.throw;
        } );

        it( 'should exclude the root from callbacks if asked', () => {
            let seenIt = false;

            const
                po = DFS( testGraph, {
                    pre:      n => n === 0 && ( seenIt = true ),
                    preOrder: true, excludeRoot: true
                } ).preOrder;

            expect( seenIt ).to.be.false;
            expect( po ).to.eql( [ 0, 1, 2, 3, 4, 6, 7, 8, 5 ] );
        } );

        it( 'should walk a walk with a non-object', () => {
            const
                result = DFS( testGraph, 'definitely-not-an-object' );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( correctPreOrder );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
        } );

        it( 'should return reverse orders if requested', () => {
            const
                result = DFS( testGraph, { preOrder: false, postOrder: false, rPreOrder: true, rPostOrder: true, trusted: true } );

            expect( result ).to.not.have.property( 'preOrder' );
            expect( result ).to.not.have.property( 'postOrder' );
            expect( result ).to.have.property( 'rPreOrder' );
            expect( result.rPreOrder ).to.eql( correctPreOrder.slice().reverse() );
            expect( result ).to.have.property( 'rPostOrder' );
            expect( result.rPostOrder ).to.eql( correctPostOrder.slice().reverse() );

        } );

        it( 'should understand a mixed array', () => {
            const
                result = DFS( irregularTestGraph );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( correctPreOrder );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
        } );

        it( 'should fire callbacks', () => {
            const
                cbPre    = [],
                cbPost   = [],
                cbrPre   = [],
                cbrPost  = [],
                seen     = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                tree     = [],
                back     = [],
                forward  = [],
                cross    = [],
                allEdges = ( from, to, type ) => type === 'tree' && seen[ to ]++;

            allEdges.tree    = ( from, to ) => tree.push( [ from, to ] );
            allEdges.forward = ( from, to ) => forward.push( [ from, to ] );
            allEdges.back    = ( from, to ) => back.push( [ from, to ] );
            allEdges.cross   = ( from, to ) => cross.push( [ from, to ] );

            DFS( {
                nodes: irregularTestGraph,
                pre( n ) { cbPre.push( n ); },
                rpre( n ) { cbrPre.push( n ); },
                post( n ) { cbPost.push( n ); },
                rpost( n ) { cbrPost.push( n ); },
                edge:  allEdges
            } );

            expect( cbPre ).to.eql( correctPreOrder );
            expect( cbPost ).to.eql( correctPostOrder );
            expect( cbrPre ).to.eql( correctPreOrder.slice().reverse() );
            expect( cbrPost ).to.eql( correctPostOrder.slice().reverse() );

            expect( seen ).to.eql( [ 0, 1, 1, 1, 1, 1, 1, 1, 1 ] );
            expect( tree ).to.eql( [
                [ 0, 1 ],
                [ 1, 2 ],
                [ 2, 3 ],
                [ 3, 4 ],
                [ 4, 6 ],
                [ 6, 7 ],
                [ 7, 8 ],
                [ 3, 5 ]
            ] );
            expect( back ).to.eql( [ [ 6, 2 ] ] );
            expect( forward ).to.eql( [ [ 1, 3 ], [ 0, 8 ] ] );
            expect( cross ).to.eql( [ [ 5, 6 ] ] );
        } );

        it( 'should accept an array of nodes in the options object and a bad length', () => {
            const
                result = DFS( { nodes: irregularTestGraph, startIndex: -irregularTestGraph.length, spanningTree: false } );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( correctPreOrder );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
        } );

        it( 'should throw if a bad list was provided in the options', () => {

            expect( DFS.bind( null, { nodes: 'blah', startIndex: -irregularTestGraph.length } ) ).to.throw( TypeError );

        } );

        it( 'should walk with an odd start', () => {
            const
                offsetTestGraph = [
                    [ 1, 2 ],    // a
                    [ 2 ],       // b
                    [ 3, 4 ],    // c
                    [ 5 ],       // d
                    [ 6 ],       // e
                    [ 6, 1 ],    // f
                    [ 7 ],       // g
                    [],           // end
                    [ 0, 7 ]    // start
                ],
                result          = DFS( testGraph, { preOrder: true, postOrder: true, startIndex: offsetTestGraph.length - 1 } );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.postOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( [ 8, 0, 1, 2, 3, 4, 6, 7, 5 ] );
            expect( result.postOrder ).to.eql( correctPostOrder );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );

        } );
    } );

    describe( 'BFS', function() {

        it( 'should perform a breadth-first traversal, no callbacks', () => {
            const
                result = BFS( bfsBackedge );

            expect( result ).to.be.an( 'object' );
            expect( result.preOrder ).to.be.an( 'array' );
            expect( result.preOrder ).to.eql( [ 0, 1, 8, 2, 3, 4, 5, 6, 7 ] );
            expect( result.levels ).to.be.an( 'array' );
            expect( result.levels ).to.eql( [ 0, 1, 2, 2, 3, 3, 4, 5, 1 ] );
            expect( result.preOrder ).to.eql( [ 0, 1, 8, 2, 3, 4, 5, 6, 7 ] );
            expect( result ).to.not.have.property( 'postOrder' );
            expect( result ).to.not.have.property( 'rPreOrder' );
            expect( result ).to.not.have.property( 'rPostOrder' );
            expect( result.edges ).to.be.an( 'object' );
            expect( result.edges.tree ).to.be.an( 'array' );
            expect( result.edges.tree ).to.eql( [
                [ 0, 1 ],
                [ 0, 8 ],
                [ 1, 2 ],
                [ 1, 3 ],
                [ 3, 4 ],
                [ 3, 5 ],
                [ 4, 6 ],
                [ 6, 7 ]
            ] );

            expect( result.edges.tree ).to.be.an( 'array' );
            expect( result.edges.back ).to.eql( [ [ 6, 4 ] ] );
            expect( result.edges.cross ).to.eql( [ [ 2, 3 ], [ 5, 6 ], [ 6, 2 ], [ 7, 8 ] ] );

        } );

    } );

    describe( 'simple pre-order traversals', function() {

        it( 'needs a function', () => {
            expect( preOrder.bind( null, testGraph ) ).to.throw( TypeError );
        } );

        it( 'should do a quick pre-order traversal', () => {
            const
                genIncSeq = [],
                preSeq    = [];

            preOrder( testGraph, ( nodeNum, preNum ) => {
                preSeq.push( nodeNum );
                genIncSeq.push( preNum );
            } );

            expect( preSeq ).to.eql( [ 0, 1, 2, 3, 4, 6, 7, 8, 5 ] );
            expect( genIncSeq ).to.eql( incSeq );
        } );

        it( 'should be able to abort a pre-order walk with a special return value', () => {
            const
                preSeq = [];

            let returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                return nodeNum === 3 && kill;
            } );

            expect( preSeq ).to.eql( [ 0, 1, 2, 3 ] );
            expect( returnValue ).to.equal( 3 );
        } );

        it( 'should be able to abort a pre-order walk with a special function, optionally returning a value', () => {

            let returnValue,
                preSeq = [];

            returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                nodeNum === 4 && kill();
            }, 0 );
            expect( preSeq ).to.eql( [ 0, 1, 2, 3, 4 ] );
            expect( returnValue ).to.equal( 4 );

            preSeq.length = 0;

            returnValue = preOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                nodeNum === 3 && kill( 1 );
            } );
            expect( preSeq ).to.eql( [ 0, 1, 2, 3 ] );
            expect( returnValue ).to.equal( 1 );
        } );

    } );

    describe( 'simple post-order traversals', function() {

        it( 'needs a function', () => {
            expect( postOrder.bind( null, testGraph ) ).to.throw( TypeError );
        } );

        it( 'should do a quick post-order traversal', () => {
            const
                incSeq    = testGraph.map( ( _, i ) => i ),
                genIncSeq = [],
                postSeq   = [];

            postOrder( testGraph, ( nodeNum, postNum ) => {
                postSeq.push( nodeNum );
                genIncSeq.push( postNum );
            } );

            expect( postSeq ).to.eql( [ 8, 7, 6, 4, 5, 3, 2, 1, 0 ] );
            expect( genIncSeq ).to.eql( incSeq );
        } );

        it( 'should be able to abort a post-order walk with a special return value', () => {
            const
                postSeq = [];

            let returnValue = postOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                return nodeNum === 4 && kill;
            }, 0 );

            expect( postSeq ).to.eql( [ 8, 7, 6, 4 ] );
            expect( returnValue ).to.equal( 4 );
        } );

        it( 'should be able to abort a post-order walk with a special function, optionally returning a value', () => {

            let returnValue,
                postSeq = [];

            returnValue = postOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                nodeNum === 4 && kill();
            } );
            expect( postSeq ).to.eql( [ 8, 7, 6, 4 ] );
            expect( returnValue ).to.equal( 4 );

            postSeq.length = 0;

            returnValue = postOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                nodeNum === 3 && kill( 1 );
            } );
            expect( postSeq ).to.eql( [ 8, 7, 6, 4, 5, 3 ] );
            expect( returnValue ).to.equal( 1 );
        } );

    } );

    describe( 'simple reverse pre-order traversals', function() {

        it( 'needs a function', () => {
            expect( rPreOrder.bind( null, testGraph ) ).to.throw( TypeError );
        } );

        it( 'should do a quick reverse pre-order traversal', () => {
            const
                incSeq    = testGraph.map( ( _, i ) => i ),
                genIncSeq = [],
                preSeq    = [];

            rPreOrder( testGraph, ( nodeNum, preNum ) => {
                preSeq.push( nodeNum );
                genIncSeq.push( preNum );
            } );

            expect( preSeq ).to.eql( [ 5, 8, 7, 6, 4, 3, 2, 1, 0 ] );
            expect( genIncSeq ).to.eql( incSeq );
        } );

        it( 'should be able to abort a reverse pre-order walk with a special return value', () => {
            const
                preSeq = [];

            let returnValue = rPreOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                return nodeNum === 3 && kill;
            }, 0 );

            expect( preSeq ).to.eql( [ 5, 8, 7, 6, 4, 3 ] );
            expect( returnValue ).to.equal( 3 );
        } );

        it( 'should be able to abort a reverse pre-order walk with a special function, optionally returning a value', () => {

            let returnValue,
                preSeq = [];

            returnValue = rPreOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                if ( nodeNum === 4 ) kill();
            } );
            expect( preSeq ).to.eql( [ 5, 8, 7, 6, 4 ] );
            expect( returnValue ).to.equal( 4 );

            preSeq.length = 0;

            returnValue = rPreOrder( testGraph, ( nodeNum, index, kill ) => {
                preSeq.push( nodeNum );
                if ( nodeNum === 3 ) kill( 1 );
            } );
            expect( preSeq ).to.eql( [ 5, 8, 7, 6, 4, 3 ] );
            expect( returnValue ).to.equal( 1 );
        } );

    } );

    describe( 'simple reverse post-order traversals', function() {

        it( 'needs a function', () => {
            expect( rPostOrder.bind( null, testGraph ) ).to.throw( TypeError );
        } );

        it( 'should do a quick reverse post-order traversal', () => {
            const
                incSeq    = testGraph.map( ( _, i ) => i ),
                genIncSeq = [],
                postSeq   = [];

            rPostOrder( testGraph, ( nodeNum, postNum ) => {
                postSeq.push( nodeNum );
                genIncSeq.push( postNum );
            } );

            expect( postSeq ).to.eql( [ 0, 1, 2, 3, 5, 4, 6, 7, 8 ] );
            expect( genIncSeq ).to.eql( incSeq );
        } );

        it( 'should be able to abort a reverse post-order walk with a special return value', () => {
            const
                postSeq = [];

            let returnValue = rPostOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                return nodeNum === 3 && kill;
            }, 0 );

            expect( postSeq ).to.eql( [ 0, 1, 2, 3 ] );
            expect( returnValue ).to.equal( 3 );
        } );

        it( 'should be able to abort a reverse post-order walk with a special function, optionally returning a value', () => {

            let returnValue,
                postSeq = [];

            returnValue = rPostOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                if ( nodeNum === 4 ) kill();
            } );
            expect( postSeq ).to.eql( [ 0, 1, 2, 3, 5, 4 ] );
            expect( returnValue ).to.equal( 4 );

            postSeq.length = 0;

            returnValue = rPostOrder( testGraph, ( nodeNum, index, kill ) => {
                postSeq.push( nodeNum );
                if ( nodeNum === 3 ) kill( 1 );
            } );
            expect( postSeq ).to.eql( [ 0, 1, 2, 3 ] );
            expect( returnValue ).to.equal( 1 );
        } );

    } );

} );
