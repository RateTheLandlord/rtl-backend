#!/bin/bash

# Prompt the user for the Docker container name
read -p "Enter the CONTAINER ID of your Docker container: " container_name

# Prompt the user for the PostgreSQL username
read -p "Enter the PostgreSQL username: " username

# Prompt the user for the number of dummy rows
read -p "Enter the number of dummy rows to load: " num_rows

# Generate random names for landlords
names=("Johns Housing Services" "Janes Home Help'" "Davids Ltd." "Emilys Help" "Michaels Tenant Resource" "Sarahs Tenants" "James the Lawyer"
      "Lindas Housing Guild" "Robert Attorney" "Karen Home Help" "Daniels Tenant Help" "Jessica the Super Tenant" "William the Mayor"
       "Amandas Landlord Review" "Christophers Renter Resource")
num_names=${#names[@]}

# Generate random cities and corresponding states
states_ca=("Ontario" "Quebec" "British Columbia" "Alberta" "Manitoba")
states_us=("California" "New York" "Texas" "Florida" "Illinois")
states_gb=("England" "Scotland" "Wales" "Northern Ireland")
states_au=("New South Wales" "Queensland" "Victoria" "Western Australia" "South Australia")
states_nz=("Auckland" "Wellington" "Canterbury" "Waikato" "Otago")

generate_random_description() {
  lorem_ipsum="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis gravida condimentum. Integer rhoncus quam eget lacus fermentum fringilla. Vestibulum nec ligula lobortis, interdum eros et, pulvinar justo. Sed sollicitudin facilisis commodo. Proin finibus, metus a tristique gravida, ex neque sollicitudin ipsum, sit amet viverra tortor arcu nec est. Curabitur quis efficitur nisl, a accumsan odio. Sed in consequat lacus. Sed ac semper libero. Nulla dictum lectus nibh, nec lobortis est vehicula vel. Vestibulum tempus sollicitudin neque, vitae volutpat lacus porttitor et. Cras faucibus viverra mi, vitae ullamcorper nulla pharetra sed. Sed et mauris ultrices, efficitur mauris in, finibus justo. Fusce iaculis id diam et gravida."

  min_length=10
  max_length=200

  length=$(shuf -i "$min_length"-"$max_length" -n 1)
  echo "${lorem_ipsum:0:length}"
}

# Generate random values and insert into the table
echo "Generating dummy data..."

for ((i=1; i<=num_rows; i++)); do
  # Generate random values
  name=${names[$((RANDOM % num_names))]}
  country_index=$((RANDOM % 5))
  country_code=("CA" "US" "GB" "AU" "NZ")
  country=${country_code[$country_index]}

  case $country in
    "CA")
      state=${states_ca[$((RANDOM % 5))]}
      ;;
    "US")
      state=${states_us[$((RANDOM % 5))]}
      ;;
    "GB")
      state=${states_gb[$((RANDOM % 4))]}
      ;;
    "AU")
      state=${states_au[$((RANDOM % 5))]}
      ;;
    "NZ")
      state=${states_nz[$((RANDOM % 5))]}
      ;;
  esac

  case $state in
    "Ontario")
      city="Toronto"
      ;;
    "Quebec")
      city="Quebec City"
      ;;
    "British Columbia")
      city="Victoria"
      ;;
    "Alberta")
      city="Edmonton"
      ;;
    "Manitoba")
      city="Winnipeg"
      ;;
    "California")
      city="Sacramento"
      ;;
    "New York")
      city="New York City"
      ;;
    "Texas")
      city="Austin"
      ;;
    "Florida")
      city="Miami"
      ;;
    "Illinois")
      city="Chicago"
      ;;
    "England")
      city="London"
      ;;
    "Scotland")
      city="Edinburgh"
      ;;
    "Wales")
      city="Cardiff"
      ;;
    "Northern Ireland")
      city="Belfast"
      ;;
    "New South Wales")
      city="Sydney"
      ;;
    "Queensland")
      city="Brisbane"
      ;;
    "Victoria")
      city="Melbourne"
      ;;
    "Western Australia")
      city="Perth"
      ;;
    "South Australia")
      city="Adelaide"
      ;;
    "Auckland")
      city="Auckland"
      ;;
    "Wellington")
      city="Wellington"
      ;;
    "Canterbury")
      city="Christchurch"
      ;;
    "Waikato")
      city="Hamilton City"
      ;;
    "Otago")
      city="Dunedin"
      ;;
  esac

  description=$(generate_random_description)

  # Insert the data into the table
  docker exec -it "$container_name" psql -U "$username" -c "INSERT INTO tenant_resource (name, country_code, city, state, description) VALUES ('$name', '$country', '$city', '$state', '$description');"
done

echo "Data loaded successfully!"