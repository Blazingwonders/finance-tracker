**The intelligent Finance Tracker!**

Features:
- Reading of bills through AI (Google Gemini)

Implementation:
create a .env file in the root of the project. Following variables must be defined in this:
- Google Gemini API code
- Username, password of your Postgres user account and the name of the database & Port on which the database runs
- Create the table using the according run script (to be published soon -> create it in your own. See the current table structure from the code)

I recomend hosting this webserver on your household internet through a Raspberry Pi. This enables every device connected to your household Wifi access to the webpage.
