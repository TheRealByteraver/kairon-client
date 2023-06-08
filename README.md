This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
- finish coin detail page
- check production build
- take care of sorting in table
- fix form input error msg CSS
- provide CryptoGecko attribution ("powered by CryptoGecko")

## Issues
- find out why Vercel throws css away on publish
- fix react query refetch interval thing
- fix "hidden" columns => check react-table docs (https://tanstack.com/table/v8/docs/api/core/table)

## Ideas
- connect kairon.erland.info to frontend on Vercel: https://kairon-client.vercel.app/ ? https ?
- show whether CoinGecko API is online or not

## Done
- take care of /archive page
- fix bug (probably related to next js) where updates from queries never shop up on the page (production build)
- fix react-query issue: new coins do not show up until refresh --> use invalidate query
- db & api opnieuw maken met primary key & params
- extract helper function from WeekCharts component -> moved to function that queries coinGecko
- fix time delta calculation: go back exactly one week instead of "24 * 7" hours -> not used anymore
- add garbage icon in frontend
- add comma's to display of large numbers in table
- add market cap value to token object
- test what happens if CoinGecko APi gets request for non existent token => unknown tokens are silently ignored

## useful resources:
- https://tanstack.com/query/v4/docs/react/guides/query-functions
- https://medium.com/doctolib/react-query-cachetime-vs-staletime-ec74defc483e
- https://www.youtube.com/watch?v=Nm0inP3B_zs&list=PLC3y8-rFHvwjTELCrPrcZlo6blLBUspd2&index=2&ab_channel=Codevolution


