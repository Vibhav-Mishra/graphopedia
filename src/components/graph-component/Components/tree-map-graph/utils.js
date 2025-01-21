export const getParentLabel = (data, targetData) => {
    // Recursive function to traverse the entire data structure and find the parent label
    const traverse = (node, target) => {
        // Check if the current node has children
        if (node.children) {
            // Iterate through each child
            for (const child of node.children) {
                // Check if the child data matches the target data
                if (JSON.stringify(child) === JSON.stringify(target)) {
                    // Return the label of the parent node
                    return node.label;
                }
                // Recursively traverse the child node
                const result = traverse(child, target);
                // If the parent label is found in any child node, return it
                if (result) return result;
            }
        }
        // Return null if the target data is not found in the current branch
        return null;
    };

    // Start traversing from the root of the data structure
    for (const node of data.children) {
        const result = traverse(node, targetData);
        // If the parent label is found in any branch, return it
        if (result) return result;
    }

    // Return null if the target data is not found in the entire data structure
    return null;
};


export function formatNumber(value) {
    if (value >= 1e12) {
        return (value / 1e12).toFixed((value % 1e12 === 0) ? 0 : 1) + 'T';
    } else if (value >= 1e9) {
        return (value / 1e9).toFixed((value % 1e9 === 0) ? 0 : 1) + 'B';
    } else if (value >= 1e6) {
        return (value / 1e6).toFixed((value % 1e6 === 0) ? 0 : 1) + 'M';
    } else if (value >= 1e3) {
        return (value / 1e3).toFixed((value % 1e3 === 0) ? 0 : 1) + 'K';
    } else {
        return value.toString();
    }
}

export function extractUniqueLabelsAndColors(data, defaultColor, isDefaultTreeColor) {
    const result = new Map();

    function traverse(node) {
        if (node.children) {
            node.children.forEach(child => {
                traverse(child);
            });
        } else {
            if (!result.has(node.label)) {
                result.set(node.label, isDefaultTreeColor ? defaultColor : node.color);
            }
        }
    }

    traverse(data);

    // Convert the Map to an array of objects
    return [
        ...Array.from(result, ([label, color]) => ({ label, color })),
        { label: "Default", color: defaultColor }
    ];
}