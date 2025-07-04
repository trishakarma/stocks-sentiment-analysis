# stocks-sentiment-analysis
Full-stack web app that visualizes your portfolio performance with real-time market data, alongside sentiment analysis from tweets. Tweets are embedded using sentence-transformers and stored as vector embeddings in a SingleStore database.

Built with React, Express, Jupyter Notebook, and SingleStoreDB; using TypeScript, Python, SQL, HTML, and JavaScript.

<img width="1470" alt="sentiment-analysis" src="https://github.com/user-attachments/assets/afc094dd-fc9d-42d2-80e1-fad72447c909" />



To run this app, you will first have to set up your SingleStore account (database + Jupyter notebook), make a .env file with your Host, DB_Port, Password details, then run in terminal with npm run dev. You can change your stocks watchlist in client/data.ts. Keep an eye out - I have some updates planned.
