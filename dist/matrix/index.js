class Matrix_Method {
    constructor() {
        this.A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Matrix A
        this.B = [[0], [0], [0]]; // Constant matrix B
        this.temp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Temporary matrix
        this.adj = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Adjoint matrix
        this.a_inverse = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Inverse of matrix A
        this.resultant = [[0], [0], [0]]; // Resultant matrix
        this.det = 0; // Determinant of matrix A
        this.inverse_of_det = 0; // Inverse of determinant of matrix A
        this.answer = ["", "", ""]; // Placeholder for user confirmation
        this.consistency = 0;
    }

    // Function to set matrix A from HTML input
    setMatrixA(matrixValues) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.A[i][j] = parseFloat(matrixValues[i * 3 + j]);
            }
        }
    }

    // Function to set constant matrix B from HTML input
    setMatrixB(values) {
        for (let i = 0; i < 3; i++) {
            this.B[i][0] = parseFloat(values[i]);
        }
    }

    // Calculate determinant of matrix A
    calculateDeterminant() {
        this.det = (this.A[0][0] * (this.A[1][1] * this.A[2][2] - this.A[2][1] * this.A[1][2])) -
                   (this.A[0][1] * (this.A[1][0] * this.A[2][2] - this.A[2][0] * this.A[1][2])) +
                   (this.A[0][2] * (this.A[1][0] * this.A[2][1] - this.A[2][0] * this.A[1][1]));
        return this.det;
    }

    // Calculate adjoint matrix of matrix A
    calculateAdjoint() {
        this.temp[0][0] = this.A[1][1] * this.A[2][2] - this.A[1][2] * this.A[2][1];
        this.temp[0][1] = -(this.A[1][0] * this.A[2][2] - this.A[1][2] * this.A[2][0]);
        this.temp[0][2] = this.A[1][0] * this.A[2][1] - this.A[1][1] * this.A[2][0];

        this.temp[1][0] = -(this.A[0][1] * this.A[2][2] - this.A[0][2] * this.A[2][1]);
        this.temp[1][1] = this.A[0][0] * this.A[2][2] - this.A[0][2] * this.A[2][0];
        this.temp[1][2] = -(this.A[0][0] * this.A[2][1] - this.A[0][1] * this.A[2][0]);

        this.temp[2][0] = this.A[0][1] * this.A[1][2] - this.A[0][2] * this.A[1][1];
        this.temp[2][1] = -(this.A[0][0] * this.A[1][2] - this.A[0][2] * this.A[1][0]);
        this.temp[2][2] = this.A[0][0] * this.A[1][1] - this.A[0][1] * this.A[1][0];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.adj[j][i] = this.temp[i][j];
            }
        }
    }

    // Calculate inverse matrix A and resultant matrix
    calculateInverseAndResultant() {
        if (this.det !== 0) {
            this.inverse_of_det = 1.0 / this.det;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.a_inverse[i][j] = this.inverse_of_det * this.adj[i][j];
                }
            }

            for (let i = 0; i < 3; i++) {
                this.resultant[i][0] = 0.0;
                for (let j = 0; j < 3; j++) {
                    this.resultant[i][0] += this.a_inverse[i][j] * this.B[j][0];
                }
            }
        }
        else {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    this.consistency += this.adj[i][j] * this.B[j][0];
                }
            }
        }
    }

    // Output results to console
    output() {
        console.log(`Determinant of the matrix A: ${this.det}`);

        console.log("Adjoint matrix:");
        for (let i = 0; i < 3; i++) {
            let row = "";
            for (let j = 0; j < 3; j++) {
                row += this.adj[i][j] + " ";
            }
            console.log(row);
        }

        console.log("Inverse matrix:");
        for (let i = 0; i < 3; i++) {
            let row = "";
            for (let j = 0; j < 3; j++) {
                row += this.a_inverse[i][j] + " ";
            }
            console.log(row);
        }

        if(this.consistency != 0) {
                console.log("The system of equations is inconsistent");
            }
            else if(this.consistency == 0) {
                console.log("The system of equation may have infinite or 0 solutions");
            }
            else {
                console.log("Unknown error");
        }
        
        console.log("Resultant matrix:");
        for (let i = 0; i < 3; i++) {
            console.log(this.resultant[i][0]);
        }

        console.log("Constant matrix:");
        for (let i = 0; i < 3; i++) {
            console.log(this.B[i][0]);
        }
    }

    updateResults() {
        // Update the determinant result
        let determinantMatrix = document.getElementById('determinant');
        determinantMatrix.innerHTML = ''; // Clear any existing content
        let determinantText = document.createElement('p');
        determinantText.textContent = `Determinant of the matrix A = ${this.det}`;
        determinantMatrix.appendChild(determinantText);

        
        // Update the adjoint matrix
        let adjointMatrix = document.getElementById('adjoint');
        adjointMatrix.innerHTML = ''; // Clear any existing content
        let adjointText = document.createElement('p');
        adjointText.innerHTML = "Adjoint of the matrix:";
        adjointMatrix.appendChild(adjointText);
    
        for (let i = 0; i < 3; i++) {
            let rowMatrix = document.createElement('p');
            rowMatrix.textContent = this.adj[i].map(val => val.toFixed(3).padStart(10, ' ')).join('');
            adjointMatrix.appendChild(rowMatrix);
        }

        let consistencyCheck = document.getElementById('consistency');
        consistencyCheck.innerHTML = '';
        let consistencyCheckText = document.createElement('p');
        if(this.consistency != 0) {
                consistencyCheckText.innerHTML = `Adj of A * B = ${this.consistency}. Therefore system of equations is inconsistent`;
            }
            else if(this.consistency == 0) {
                consistencyCheckText.innerHTML = `Adj of A * B = ${this.consistency}. Therefore system of equation may have infinite or 0 solutions`;
            }
            else {
                consistencyCheckText.innerHTML = `Adj of A * B = ${this.consistency}. Unknown error`;
        }
        consistencyCheck.appendChild(consistencyCheckText);
    
        // Update the inverse matrix
        let inverseMatrix = document.getElementById('inverse');
        inverseMatrix.innerHTML = ''; // Clear any existing content
        let inverseText = document.createElement('p');
        inverseText.innerHTML = "Inverse of the matrix:";
        inverseMatrix.appendChild(inverseText);
    
        for (let i = 0; i < 3; i++) {
            let rowMatrix = document.createElement('p');
            rowMatrix.textContent = this.a_inverse[i].map(val => val.toFixed(6).padStart(10, ' ')).join(' ');
            inverseMatrix.appendChild(rowMatrix);
        }
    
        // Update the resultant matrix
        let resultantMatrix = document.getElementById('resultant');
        resultantMatrix.innerHTML = ''; // Clear any existing content
        let resultantText = document.createElement('p');
        resultantText.textContent = "Resultant matrix:";
        resultantMatrix.appendChild(resultantText);
    
        for (let i = 0; i < 3; i++) {
            let rowMatrix = document.createElement('p');
            rowMatrix.textContent = this.resultant[i][0].toFixed(6).padStart(10, ' ');
            resultantMatrix.appendChild(rowMatrix);
        }
    
        // Update the constant matrix
        let constantMatrix = document.getElementById('constant');
        constantMatrix.innerHTML = ''; // Clear any existing content
        let constantText = document.createElement('p');
        constantText.textContent = "Constant matrix:";
        constantMatrix.appendChild(constantText);
    
        for (let i = 0; i < 3; i++) {
            let rowMatrix = document.createElement('p');
            rowMatrix.textContent = this.B[i][0];
            constantMatrix.appendChild(rowMatrix);
        }
    }
}

// Function to handle input from HTML form
function processInput() {
    const M = new Matrix_Method();
    let matrixValues = [];
    let constantMatrixValues = [];

    // Retrieve matrix values from HTML input
    for (let i = 0; i < 9; i++) {
        matrixValues.push(parseFloat(document.getElementById(`A${Math.floor(i / 3)}${i % 3}`).value));
    }

    // Retrieve constant matrix values from HTML input
    for (let i = 0; i < 3; i++) {
        constantMatrixValues.push(parseFloat(document.getElementById(`B${i}`).value));
    }

    // Set matrix A and constant matrix B in Matrix_Method instance
    M.setMatrixA(matrixValues);
    M.setMatrixB(constantMatrixValues);

    // Perform calculations and output results
    M.calculateDeterminant();
    M.calculateAdjoint();
    M.calculateInverseAndResultant();
    M.output();
    M.updateResults();
}
