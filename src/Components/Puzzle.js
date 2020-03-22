import React, { useState, useRef, useMemo } from 'react'
import './Puzzle'

const isSolvable = (size, tiles) => {
    let invCount = 0
    for (let i = 0; i < size * size - 1; i++) {
        for (let j = i + 1; j < size * size; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) invCount++;
        }
    }
    if (size % 2) {
        return invCount % 2 === 0
    } else {
        const holeRow = Math.floor(tiles.indexOf(0) / size)
        return size - (holeRow % 2) !== invCount % 2
    }
}

const useSize = ref => {
    const [size, setSize] = useState([0, 0])



}

//here can the size of the Game board be changed
const Game = ({ size = 4 }) => {
    const initialTiles = useMemo(() => {
        const [hole, ...rest] = Array(size * size)
            .fill(null)
            .map((_, i) => i)
        return [...rest, hole]
    }, [size])
}

const [tiles, setTiles] = useState([])

//insert some kind of shuffle with button onClick

//insert move the Tiles 


const gridRef = useRef()
const [gridSize, gridReady] = useSize(gridRef)

const [tileWidth, tileHight] = useMemo(() => gridSize.map(dim => dim / size), [gridSize, size])

export const Puzzle = () => {

    return (

        <div className="back-ground">
            <div className="board">
                <ul className="grid">
                    <li>
                        <button className="number-btn" onclick={() => ('')}>
                            {/* {number} */}
                           1
            </button>
                    </li>
                </ul>


            </div>

        </div>
    )

}

