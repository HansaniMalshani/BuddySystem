import React, { useState } from 'react';

function App() {
  // Initialize the total memory and memory blocks
  const [totalMemory] = useState(1024); // Set the total memory size (e.g., 1024 KB)
  const [memoryBlocks, setMemoryBlocks] = useState([{ size: totalMemory, allocated: false }]);
  const [requestSize, setRequestSize] = useState('');
  const [deallocateIndex, setDeallocateIndex] = useState('');
  const [message, setMessage] = useState('');

  // Function to allocate memory
  const allocateMemory = () => {
    const size = parseInt(requestSize);
    if (!size || size <= 0) {
      setMessage('Enter a valid memory size!');
      return;
    }

    // Find the smallest power of 2 that can satisfy the request
    let requiredSize = 1;
    while (requiredSize < size) {
      requiredSize *= 2;
    }

    const newMemoryBlocks = [...memoryBlocks];
    let allocationDone = false;

    for (let i = 0; i < newMemoryBlocks.length; i++) {
      const block = newMemoryBlocks[i];
      if (!block.allocated && block.size >= requiredSize) {
        // Split the block if necessary
        while (block.size > requiredSize) {
          const buddySize = block.size / 2;
          newMemoryBlocks.splice(i + 1, 0, { size: buddySize, allocated: false });
          block.size = buddySize;
        }

        // Mark the block as allocated
        block.allocated = true;
        allocationDone = true;
        setMessage(`Allocated ${size} KB.`);
        break;
      }
    }

    if (!allocationDone) {
      setMessage(`Failed to allocate ${size} KB. Not enough space.`);
    }

    setMemoryBlocks(newMemoryBlocks);
    setRequestSize('');
  };

  // Function to deallocate memory
  const deallocateMemory = () => {
    const index = parseInt(deallocateIndex);
    if (isNaN(index) || index < 0 || index >= memoryBlocks.length) {
      setMessage('Enter a valid block index to deallocate!');
      return;
    }

    const newMemoryBlocks = [...memoryBlocks];
    const block = newMemoryBlocks[index];

    if (!block.allocated) {
      setMessage('The selected block is already free!');
      return;
    }

    // Mark the block as free
    block.allocated = false;

    // Merge buddy blocks if possible
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < newMemoryBlocks.length - 1; i++) {
        const currentBlock = newMemoryBlocks[i];
        const nextBlock = newMemoryBlocks[i + 1];

        // Check if both blocks are free and have the same size
        if (!currentBlock.allocated && !nextBlock.allocated && currentBlock.size === nextBlock.size) {
          // Merge the blocks
          currentBlock.size *= 2;
          newMemoryBlocks.splice(i + 1, 1);
          merged = true;
          break;
        }
      }
    }

    setMemoryBlocks(newMemoryBlocks);
    setDeallocateIndex('');
    setMessage('Block deallocated successfully!');
  };

  // Function to display memory blocks
  const displayMemory = () =>
    memoryBlocks.map((block, index) => (
      <div
        key={index}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          margin: '5px',
          backgroundColor: block.allocated ? '#f8d7da' : '#d4edda',
        }}
      >
        <p>
          <strong>Size:</strong> {block.size} KB
        </p>
        <p>
          <strong>Status:</strong> {block.allocated ? 'Allocated' : 'Free'}
        </p>
        <p>
          <strong>Index:</strong> {index}
        </p>
      </div>
    ));

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Buddy System Memory Allocation</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Enter Memory Request (in KB):{' '}
          <input
            type="number"
            value={requestSize}
            onChange={(e) => setRequestSize(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
        </label>
        <button onClick={allocateMemory} style={{ marginRight: '10px' }}>
          Allocate
        </button>
        <button onClick={() => setRequestSize('')}>Clear</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Enter Block Index to Deallocate:{' '}
          <input
            type="number"
            value={deallocateIndex}
            onChange={(e) => setDeallocateIndex(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
        </label>
        <button onClick={deallocateMemory} style={{ marginRight: '10px' }}>
          Deallocate
        </button>
        <button onClick={() => setDeallocateIndex('')}>Clear</button>
      </div>

      {message && <p style={{ color: '#007bff' }}>{message}</p>}

      <h2>Memory State</h2>
      <div>{displayMemory()}</div>
    </div>
  );
}

export default App;
