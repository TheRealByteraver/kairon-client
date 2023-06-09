This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Purpose
This application shows the current state of affairs of a list of tokens (cryptocurrency coins): how much they are worth, their price variation over the past week, past day and past hour. Clicking on any token reveals some details about the particular token. The information is taken from the coinGecko API.
The user can customize the token list by adding/removing tokens. The application keeps track of this list in a sqlite database through an API written in Python (see below).
Finally, the app keeps track of removed tokens on the /archive page. Removed tokens can be reactivated here.

## Instructions

### Install the client

- Note: these instructions are for a Windows OS, if you use a different OS you might need to do some googling.

Download the repository and the dependencies to your machine:
```bash
git clone https://github.com/TheRealByteraver/kairon-client.git
cd kairon-client
npm install
```

Create a `.env.local` file in the root of the "kairon-client" folder and give it the following contents:
```
NEXT_PUBLIC_TOKEN_API_URL=http://localhost:5000
```

Run the _build_ script to compile the code, then serve the build locally:

```bash
npm run build
npm run start
```

### Install the server

Open a new terminal window and download the Python api server repository. You might need to install [pipenv](https://pypi.org/project/pipenv/) first. If you want to start with an empty database you'll have to delete the db.sqlite file and create a new db (see below)

```bash
cd ..
git clone https://github.com/TheRealByteraver/kairon-server.git
cd kairon-server
pipenv shell
pip install -r requirements.txt
```

Creation of the sqlite database - we need to do this only once. First, start python:
```bash
python
```

The cursor now changes to the Python >>> prompt. Now, enter the following commands to create the database:
```bash
from app import app
from app import db
db.create_all()
exit()
```

We're almost done. Now, start the server with the command:

```bash
python app.py
```

### Running the app

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) to check if the api is up and ready. You should see some text explaining how to use the api.

Finally,

Open [http://localhost:3000](http://localhost:3000) with your browser to see the client.


## Todo
- take care of proper sorting in table
- take care of auto refetch for coin gecko api (convert to useQuery?)
- provide CryptoGecko attribution ("powered by CoinGecko")

## Improvements
- on landing page: fetch coinGecko's /coins/list to get a list of known tokens, and use this to help the use add tokens with the form, by using autocomplete for example, and prevent addition of non-existent tokens
- improve error handling of fetch() calls, provide user feedback with modal on fetch error etc
- /:tokenName page: more details (fetch different api endpoint), show graph, fancier css
- /archive page: improve design/ looks, add "permanent token delete" functionality

## Ideas
- show online status of CoinGecko API on landing page

## useful resources:

### frontend:
- https://tanstack.com/query/v4/docs/react/guides/query-functions
- https://tkdodo.eu/blog/breaking-react-querys-api-on-purpose
- https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
- https://www.youtube.com/watch?v=Nm0inP3B_zs&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=2&ab_channel=Codevolution

### backend:
- https://www.youtube.com/watch?v=PTZiDnuC86g&ab_channel=TraversyMedia

