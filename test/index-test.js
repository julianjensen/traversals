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
    } );

} );
