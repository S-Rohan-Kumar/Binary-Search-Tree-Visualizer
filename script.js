document.addEventListener("DOMContentLoaded",()=>{
    
    const canvas = document.getElementById("mycanvas");
    const ctx = canvas.getContext('2d');
    const arraySizeInput = document.querySelector("#arraySize");
    const generatebtn = document.querySelector(".btn-primary")
    const algo_select = document.getElementById("algo-select");
    const startbtn = document.getElementById("visualizeBtn");
    const resultArea = document.querySelector(".message-area");
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");    

    arraySizeInput.addEventListener('input',()=>{
        document.querySelector("#arraySize + .range-value").textContent = `${arraySizeInput.value} elements`
    })


    function drawNode( x , y,value ,color  ="#ff4757", isHighlighted = false){

        if (isHighlighted) {
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2); 
            ctx.fillStyle = '#f1c40f'; 
            ctx.globalAlpha = 0.6; 
            ctx.fill();
            ctx.globalAlpha = 1.0; 
        }

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;
        
        // Draw outer glow ring
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fillStyle = color + '40'; 
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        const gradient = ctx.createRadialGradient(x - 8, y - 8, 0, x, y, 22);
        gradient.addColorStop(0, lightenColor(color, 30));
        gradient.addColorStop(1, color);
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = darkenColor(color, 20);
        ctx.lineWidth = 2.5;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x - 6, y - 6, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        
        ctx.restore();
        
        ctx.fillStyle = isColorLight(color) ? '#2c3e50' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(value, x, y);
        ctx.shadowBlur = 0;
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    
    function darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, (num >> 8 & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

   
    function isColorLight(color) {
        const hex = color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    }

    class Node{
        constructor(value){
            this.value = value;
            this.left=null;
            this.right=null;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            this.x = 0
            this.y = 0
            this.xIndex = 0;
        }
    } 

    class BiaryTree{
        constructor(canvascontext){
            this.ctx = canvascontext;
            this.canvas = canvascontext.canvas;
            this.root = null;
            this.inOrderCount = 0;
        }
        insert(value){
            const newNode = new Node(value);
            if(this.root===null){
                this.root = newNode;
            }
            else{
                this._insertNode(this.root,newNode);
            }
        }
        _insertNode(node,newNode){
            if(newNode.value<node.value){
                if(node.left===null) node.left = newNode;
                else this._insertNode(node.left,newNode)
            }
            else{
                if(node.right===null)  node.right = newNode;
                else this._insertNode(node.right,newNode);
            }
        }

        _assignInOrderIndex(node) {
            if (node === null) return;
            this._assignInOrderIndex(node.left);
            node.xIndex = this.inOrderCounter++;
            this._assignInOrderIndex(node.right);
        }

        _calculatePositions(node, depth = 0, totalNodes) {
            if (node === null) return;

            const horizontalSpacing = this.canvas.width / (totalNodes + 1);
            const verticalSpacing = 80;
            const yOffset = 70;

            node.x = horizontalSpacing * (node.xIndex + 1);
            node.y = yOffset + depth * verticalSpacing;

            this._calculatePositions(node.left, depth + 1, totalNodes);
            this._calculatePositions(node.right, depth + 1, totalNodes);
        }

        getInOrderTraversal(){
            let path = [];
            this._inorderpath(this.root,path);
            return path;
        }

        _inorderpath(node,path){
            if(node===null) return;
            this._inorderpath(node.left,path);
            path.push(node);
            this._inorderpath(node.right,path);
        }

        getPreOrderTraversal(){
            let path = [];
            this._preorderpath(this.root,path);
            return path;
        }

        _preorderpath(node,path){
            if(node===null) return;
            path.push(node);
            this._preorderpath(node.left,path);
            this._preorderpath(node.right,path);
        }

        getPostOrderTraversal(){
            let path = [];
            this._postorderpath(this.root,path);
            return path;
        }

        _postorderpath(node,path){
            if(node===null) return;
            this._postorderpath(node.left,path);
            this._postorderpath(node.right,path);
            path.push(node);
        }

        search(value){
            let path=[];
            let node= this.root;
            let found=false;
            while(node){
                path.push(node);
                if(node.value===value){
                    found=true;
                    break;
                }
                else if(node.value<value){
                    node = node.right;
                }
                else{
                    node=node.left;
                }
            }
            return {path,found}
        }

        draw(highlightedNodes = []) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.root === null) return;

            this.inOrderCounter = 0;
            this._assignInOrderIndex(this.root);
            const totalNodes = this.inOrderCounter;
            this._calculatePositions(this.root, 0, totalNodes);

            const allNodes = this.getInOrderTraversal(); 

            this.ctx.strokeStyle = '#555';
            this.ctx.lineWidth = 2;
            allNodes.forEach(node => {
                if (node.left) { this.ctx.beginPath(); this.ctx.moveTo(node.x, node.y); this.ctx.lineTo(node.left.x, node.left.y); this.ctx.stroke(); }
                if (node.right) { this.ctx.beginPath(); this.ctx.moveTo(node.x, node.y); this.ctx.lineTo(node.right.x, node.right.y); this.ctx.stroke(); }
            });

            allNodes.forEach(node => {
                const isHighlighted = highlightedNodes.includes(node);
                drawNode(node.x, node.y, node.value, node.color, isHighlighted);
            });
        }

    }

    let activeTree = null;

    function generatearray(arr,n){
        for(let i=0;i<n;i++){
            arr.push(Math.floor(Math.random()*100)+1);
        }
    }

    generatebtn.addEventListener('click',()=>{
        ctx.clearRect(0,0,800,600);
        activeTree = new BiaryTree(ctx);
        let array =[]
        const size = arraySizeInput.value;
        generatearray(array,size);

        const uniqueele = [...new Set(array)];

        uniqueele.forEach(node=>
            activeTree.insert(node)
        )
        activeTree.draw();
        document.querySelector('.message-area').textContent = ``;
    })

    function setControlsDisabled(isDisabled) {
        generatebtn.disabled = isDisabled;
        startbtn.disabled = isDisabled;
        algo_select.disabled = isDisabled;
        arraySizeInput.disabled = isDisabled;
    }



    async function animatepath(path){
        setControlsDisabled(true);

        const vistedNodes=[];
        for (const node of path) {
            vistedNodes.push(node);

            activeTree.draw(vistedNodes);

            await sleep(1000);
        }

        setControlsDisabled(false);
    }

    startbtn.addEventListener('click',async ()=>{
        if(activeTree){
            const algo = algo_select.value;
            let path = [];
            let algoName = "";

            switch(algo){
                case "in-order":
                    path = activeTree.getInOrderTraversal();
                    algoName = "In-Order";
                    break;
                case "pre-order":
                    path = activeTree.getPreOrderTraversal();
                    algoName = "Pre-Order";
                    break;   
                case "post-order":
                    path = activeTree.getPostOrderTraversal();
                    algoName = "Post-Order";
                    break;     
            }
            
            await animatepath(path); 
            
            const resultString = path.map(node => node.value).join(' → ');
            document.querySelector('.message-area').textContent = `${algoName}: ${resultString}`;
        }
        else{
            document.querySelector('.message-area').textContent = `Generae Tree first! `;
        }
    })

    searchBtn.addEventListener('click',async ()=>{
        if(!activeTree){
            document.querySelector('.message-area').textContent = `Generae Tree first! `;
            return;
        }
        const valuetosearch = parseInt(searchInput.value,10);
        if(isNaN(valuetosearch)){
            resultArea.textContent = "Enter a valid node";
            return ;
        }
        const result = activeTree.search(valuetosearch);

        await animatepath(result.path);

        if(result.found){
            resultArea.textContent = `Value ${valuetosearch} was found!`;
        }
        else {
            resultArea.textContent = `Value ${valuetosearch} was not found.`;
        }
    })

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

})