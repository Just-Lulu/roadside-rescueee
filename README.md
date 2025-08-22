**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS



# Roadside Rescue Project Write-up

## Project Overview

**Roadside Rescue** (sometimes branded as "RoadReady Nigeria") is a web application designed to connect stranded drivers with vetted, professional mechanics throughout Nigeria for quick and reliable roadside assistance. The platform utilizes modern web technologies such as React, TypeScript, Tailwind CSS, and Vite to deliver a fast, user-friendly experience.

## How It Works

The platform streamlines the process of getting immediate help when a vehicle breaks down. Here’s a typical user flow:

1. **Share Your Location:**  
   Users can share their real-time location via the app and provide details about their vehicle issue.

2. **Get Matched:**  
   The system matches users with nearby Nigerian mechanics who are best suited for their specific problem. This can be done either by selecting a city or using geolocation for more precise matching.

3. **Request Help:**  
   Users can describe their issue, choose a preferred contact method, and submit a request. Mechanics are then notified and can respond to the request.

4. **Get Back on the Road:**  
   The selected mechanic arrives on-site to fix the issue or tow the vehicle if necessary. Users can track mechanics in real-time and communicate with them directly via the platform.

## Key Functions

- **Mechanic Search:**  
  Users can search for mechanics either by city or by using their current location (utilizing geolocation and reverse geocoding).
  
- **Request Assistance:**  
  A streamlined form allows users to specify the type of problem (flat tire, dead battery, engine trouble, etc.), provide a detailed description, and choose how they’d like to be contacted.
  
- **Transparent Pricing & Tracking:**  
  Pricing is presented upfront in Naira, and real-time mechanic tracking is available.

- **Mechanic & Driver Accounts:**  
  Both drivers and mechanics can create accounts, allowing drivers to request help and mechanics to offer their services.

- **24/7 Availability:**  
  The service is designed to be available at all times, with average response times under 20 minutes.

## Possible Improvements

- **Live Chat & Notifications:**  
  While the current system allows for messaging and phone calls, adding real-time chat (WebSockets) and push notifications would improve communication.

- **Payment Integration:**  
  Implementing secure payment gateways for cashless transactions would add safety and convenience.

- **Rating & Feedback System:**  
  Allowing users to rate mechanics and leave feedback would help maintain quality and trust.

- **Expanded Service Types:**  
  Additional services (e.g., fuel delivery, locksmiths, battery replacement) could be integrated.

- **Mobile App Version:**  
  A dedicated mobile app (Android/iOS) would enhance accessibility, especially for users on the move.

- **AI-Powered Matching:**  
  Using AI to better match users to mechanics based on issue type, mechanic expertise, and real-time availability.

## Value to Society

- **Safety and Peace of Mind:**  
  The platform provides a lifeline to drivers stranded in unfamiliar or potentially unsafe locations, reducing anxiety and risk.

- **Economic Empowerment:**  
  By connecting local mechanics to more customers, it helps support small businesses and boost local economies.

- **Efficiency and Transparency:**  
  Reduces the time and stress involved in finding reliable roadside help, with clear pricing and service tracking.

- **Job Creation:**  
  Encourages the growth of a network of professional, vetted mechanics across Nigeria.

- **Digital Inclusion:**  
  By leveraging web technologies and potentially mobile apps, the project helps bring essential services to more people across the country.

---

**In summary:**  
Roadside Rescue is a tech-driven solution to a common problem, making Nigeria’s roads safer and more reliable for everyone. With further development and user feedback, it has the potential to become an indispensable service in the Nigerian transportation ecosystem.
````
