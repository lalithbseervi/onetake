class Matrix_Method {
    constructor() {
        this.A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Matrix A initialized with zeros
        this.B = [[0], [0], [0]]; // Constant matrix B initialized with zeros
        this.temp = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Temporary matrix initialized with zeros
        this.adj = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Adjoint matrix initialized with zeros
        this.a_inverse = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; // Inverse of matrix A initialized with zeros
        this.resultant = [[0], [0], [0]]; // Resultant matrix initialized with zeros
        this.det = 0; // Determinant of matrix A
        this.inverse_of_det = 0; // Inverse of determinant of matrix A
        this.answer = ["", "", ""]; // Placeholder for user confirmation
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

        console.log("Resultant matrix:");
        for (let i = 0; i < 3; i++) {
            console.log(this.resultant[i][0]);
        }

        console.log("Constant matrix:");
        for (let i = 0; i < 3; i++) {
            console.log(this.B[i][0]);
        }
    }

    // Function to update HTML elements with results
    updateResults() {
        document.getElementById('determinant').textContent = `Determinant of the matrix A: ${this.det}`;
        document.getElementById('determinant').innerHTML += `<br>`;
    
        let adjointText = "<br>Adjoint of the matrix:<br>";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                adjointText += `${this.adj[i][j]} `;
            }
            adjointText += "<br>";
        }
        document.getElementById('adjoint').innerHTML = adjointText + "<br>";
    
        let inverseText = "Inverse of the matrix:<br>";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                inverseText += `${this.a_inverse[i][j].toFixed(6).padStart(10, ' ')} `;
            }
            inverseText += "<br>";
        }
        document.getElementById('inverse').innerHTML = inverseText;
        document.getElementById('inverse').innerHTML += "<br>";
    
        document.getElementById('resultant').textContent = "Resultant matrix:";
        document.getElementById('resultant').innerHTML += "<br>";
        for (let i = 0; i < 3; i++) {
            document.getElementById('resultant').innerHTML += `${this.resultant[i][0].toFixed(6).padStart(10, ' ')}<br>`;
        }
    
        document.getElementById('constant').textContent = "Constant matrix:";
        document.getElementById('constant').innerHTML += "<br>";
        for (let i = 0; i < 3; i++) {
            document.getElementById('constant').innerHTML += `${this.B[i][0]}<br>`;
        }
        document.getElementById('constant').innerHTML += "<br>";
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
