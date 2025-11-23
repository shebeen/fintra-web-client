# Fintra Web Client

Fintra Web is a modern, responsive single-page application designed for managing stock trades. It provides a clean and intuitive user interface for viewing, adding, updating, and deleting trades.

## Features

- **Dashboard View**: See all your trades in a clean, organized table.
- **Profit/Loss Summary**: Get an at-a-glance view of your overall profit or loss based on the total buy and sell values of all trades.
- **Full CRUD Operations**:
  - **Create**: Add new trades using a simple and intuitive form.
  - **Read**: View all trades with key details like ticker symbol, buy/sell prices, and dates.
  - **Update**: Edit existing trades to add selling information or correct data.
  - **Delete**: Remove trades with a confirmation step to prevent accidental deletions.
- **Responsive Design**: The UI is optimized for a seamless experience on desktop, tablet, and mobile devices.

## Technologies Used

- **React**: The application is built using the React library for a component-based architecture.
- **React Context API**: State management is handled efficiently using React's built-in Context API, providing a centralized store for trade data.
- **Material UI (MUI)**: The user interface is styled with Material UI, a popular React UI framework that provides a comprehensive set of customizable components.
- **Axios**: API communication with the Fintra backend is handled using the Axios HTTP client.

## Getting Started

Follow these instructions to get the application up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Run the following command in the root directory of the project to install all the necessary packages.
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following line to configure the backend API URL. If you are running the Fintra backend locally, the default URL should work.
    ```
    REACT_APP_API_BASE_URL=http://localhost:8080
    ```

### Running the Application

Once the dependencies are installed and the environment is configured, you can start the development server:

```sh
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will automatically reload if you make any changes to the code.
