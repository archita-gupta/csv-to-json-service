
## CSV TO JSON SERVICE

### CSV Processing
- Supports nested and complex object structures in CSV headers
- Handles large files through batch processing

### Database Operations
- Bulk insert with configurable batch size
- Efficient age-based queries

### Age Distribution Analysis
- Automatic age group categorization
- Percentage distribution calculation
- Console table output for visualization

## Error Handling

The service includes comprehensive error handling for:
- Invalid CSV formats
- Database connection issues
- File system errors
- Data validation failures

## SEEDING DB
This service also includes a script to seed the database with sample data. To run the seeding script, use the following command:

```bash
node helpers/seedDb.js
```
## RUNNING THE SERVICE
Default environment is set to development and other environment variables are set in .env file.
Modify the database ceds as per your local db.
The service is built using Node version 20
To run the service, use the following command:
```bash
npm run start:dev
```
The application runs on port 3000.

### ROUTES
/convert-to-json:
- Inserts the users records into database
- Handles Age analysis distribution
- Returns a csv compatible JSON object


## License
This project is licensed under the MIT License - see the LICENSE file for details.
