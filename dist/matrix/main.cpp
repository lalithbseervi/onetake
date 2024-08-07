#include <iostream>
using namespace std;

// define all methods and data required
class Matrix_Method {
    private:
        int A[3][3], B[3][1], i, j, n=3;
        float temp[3][3], adj[3][3], a_inverse[3][3], resultant[3][1], det = 0, inverse_of_det = 0;
    public:
        void input();
        void calculate();
        void output();
};

// take the input
void Matrix_Method :: input() {
    cout << "Enter the 9 elements of the matrix of order 3.\n";
    // take the input for matrix A
    for(i=0; i<n; i++) {
        for(j=0; j<n; j++) 
            cin >> A[i][j];
    }

    // take the constant matrix
    for(i=0; i<3; i++) {
            cout << "Enter the values for the constant matrix: ";
            cin >> B[i][0];
    }
}

void Matrix_Method :: calculate() {
    // calculate determinant of matrix A
    det = (A[0][0]*(A[1][1]*A[2][2] - A[2][1]*A[1][2])) - (A[0][1]*(A[1][0]*A[2][2] - A[2][0]*A[1][2])) + (A[0][2]*(A[1][0]*A[2][1] - A[2][0]*A[1][1]));

    // calculate adjacent
    temp[0][0] = A[1][1] * A[2][2] - A[1][2] * A[2][1];
    temp[0][1] = -(A[1][0] * A[2][2] - A[1][2] * A[2][0]);
    temp[0][2] = A[1][0] * A[2][1] - A[1][1] * A[2][0];

    temp[1][0] = -(A[0][1] * A[2][2] - A[0][2] * A[2][1]);
    temp[1][1] = A[0][0] * A[2][2] - A[0][2] * A[2][0];
    temp[1][2] = -(A[0][0] * A[2][1] - A[0][1] * A[2][0]);

    temp[2][0] = A[0][1] * A[1][2] - A[0][2] * A[1][1];
    temp[2][1] = -(A[0][0] * A[1][2] - A[0][2] * A[1][0]);
    temp[2][2] = A[0][0] * A[1][1] - A[0][1] * A[1][0];

    for(i=0; i<3; ++i) {
        for(j=0; j<3; ++j)
            adj[j][i] = temp[i][j];
    }

    // calculate 1/det(A) if det(A) != 0, then calculate A inverse
    if (det != 0) {
        inverse_of_det = 1.0 / det;

        for (i = 0; i < 3; ++i) {
            for (j = 0; j < 3; ++j) {
                a_inverse[i][j] = inverse_of_det * adj[i][j];
            }
        }
    }

    // calculate resultant matrix
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            resultant[i][0] += a_inverse[i][j] * B[j][0];
        }
    }
    
}

void Matrix_Method :: output() {
    cout << "Determinant of the matrix A: " << det << "\n";

    cout << "Adjoint matrix: \n";
    for(i=0; i<n; i++) {
        for(j=0; j<n; j++) {
            cout << adj[i][j] << " ";
        }
        cout << "\n";
    }

    cout << "Inverse matrix: \n";
    for(i=0; i<n; i++) {
        for(j=0; j<n; j++) {
            cout << a_inverse[i][j] << " ";
        }
        cout << "\n";
    }

    cout << "Resultant matrix: \n";
    for(i=0; i<3; i++) {
        cout << resultant[i][0] << "\n";
    }

    cout << "Constant matrix: \n";
    for(i=0; i<3; i++) {
        cout << B[i][0] << "\n";
    }
} 

int main() {
    Matrix_Method M;
    M.input();
    M.calculate();
    M.output();
}
