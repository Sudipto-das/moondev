here i split code into different components for its looks clean,readable and maintainable i pass the through the props and use in the other components . here app.tsx is the main page its render first and its under render 3 child components and pass the data through the props.
BurnButtonBar.tsx: This component seems responsible for rendering the input box and button for burning tokens. It handles the input change and button click events. 
BurnStats.tsx: This component should render the statistics related to burning tokens. It uses custom hooks and data passed through props.
TransactionTable.tsx: This component should display the transaction details.
