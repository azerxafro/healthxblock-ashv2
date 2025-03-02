// Create a SHA-256 hash of the block data using the Web Crypto API
export async function createHash(id, timestamp, previousHash, data, nonce) {
  const blockString = `${id}${timestamp}${previousHash}${data}${nonce}`

  // Convert the string to a Uint8Array
  const encoder = new TextEncoder()
  const blockData = encoder.encode(blockString)

  // Use the Web Crypto API to create a SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", blockData)

  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

  return hashHex
}

// Verify if a block's hash is valid
export async function verifyBlockHash(block) {
  const calculatedHash = await createHash(block.id, block.timestamp, block.previousHash, block.data, block.nonce)
  return calculatedHash === block.hash
}

// Verify the entire blockchain
export async function verifyBlockchain(blocks) {
  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i]
    const previousBlock = blocks[i - 1]

    // Check if previous hash matches
    if (currentBlock.previousHash !== previousBlock.hash) {
      return false
    }

    // Verify current block hash
    if (!(await verifyBlockHash(currentBlock))) {
      return false
    }
  }

  return true
}

// Mine a new block (simplified for demonstration)
export async function mineBlock(id, timestamp, previousHash, data, difficulty = 2) {
  let nonce = 0
  let hash = ""
  const target = "0".repeat(difficulty)

  while (!hash.startsWith(target)) {
    nonce++
    hash = await createHash(id, timestamp, previousHash, data, nonce)
  }

  return {
    id,
    timestamp,
    previousHash,
    data,
    nonce,
    hash,
  }
}

