/** ******************************************************************************************************************
 * @file Description of file here.
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
    { DFS, BFS }       = require( '../index' ),
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
    correctPostOrder   = [ 8, 7, 6, 4, 5, 3, 2, 1, 0 ];


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

        it( 'should expect an array for the graph argument', () => {
            expect( DFS.bind( null, 'hello' ) ).to.throw( TypeError );
            expect( DFS.bind( null ) ).to.throw( TypeError );
        } );

        it( 'should return reverse orders if requested', () => {
            const
                result = DFS( testGraph, { preOrder: false, postOrder: false, rPreOrder: true, rPostOrder: true } );

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
                min      = ( a, b ) => a < b ? a : b,
                max      = ( a, b ) => a > b ? a : b,
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

            allEdges.tree = ( from, to ) => tree.push( [ min( from, to ), max( from, to ) ] );
            allEdges.forward = ( from, to ) => forward.push( [ min( from, to ), max( from, to ) ] );
            allEdges.back = ( from, to ) => back.push( [ min( from, to ), max( from, to ) ] );
            allEdges.cross = ( from, to ) => cross.push( [ min( from, to ), max( from, to ) ] );

            DFS( irregularTestGraph, {
                pre( n ) { cbPre.push( n ); },
                rpre( n ) { cbrPre.push( n ); },
                post( n ) { cbPost.push( n ); },
                rpost( n ) { cbrPost.push( n ); },
                edge: allEdges
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
            expect( back ).to.eql( [ [ 2, 6 ] ] );
            expect( forward ).to.eql( [ [ 1, 3 ], [ 0, 8 ] ] );
            expect( cross ).to.eql( [ [ 5, 6 ] ] );
        } );

        it( 'should accept an array of nodes in the options object and a bad length', () => {
            const
                result = DFS( { nodes: irregularTestGraph, startIndex: -irregularTestGraph.length } );

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
} );
