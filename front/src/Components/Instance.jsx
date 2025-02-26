import React from "react";
import { useSession } from '@supabase/auth-helpers-react';
import DefaultImage from "../assets/pfp1.png";

export default function Instance({ name, date, price, location, artistImage,status }) {
    const session = useSession();
    const profPic = artistImage ? artistImage : DefaultImage;

    const createCalendarEvent = async () => {
        if ((!session || !session.provider_token)) {
            alert("sign in with Google to add events to your calendar");
            return;
        }
    
        let description = `Concert: ${name}\n`;
        if (location && location.name) description += `Place: ${location.name}\n`;
        if (location && location.address && location.address.line1) description += `Address: ${location.address.line1}\n`;
        if (location && location.city && location.city.name) description += `City: ${location.city.name}\n`;
        if (location && location.country && location.country.name) description += `Country: ${location.country.name}\n`;
        if (location && location.state && location.state.name) description += `State: ${location.state.name}\n`;
        if (location && location.postalCode !== undefined) description += `Postal Code: ${location.postalCode}\n`;
        if (price && price.min !== undefined && price.max !== price.min) description += `Price Range: ${price.min} - ${price.max} ${price.currency}\n`;
        if (price && price.min !== undefined && price.max === price.min) description += `Price: ${price.min} ${price.currency}\n`;

        const startDateTime = new Date(`${date.localDate}T${date.localTime}`);

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(startDateTime.getHours() + 3);

        const event = {
            'summary': name,
            'description': description,
            'start': {
                'dateTime': startDateTime.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'end': {
                'dateTime': endDateTime.toISOString(),
                'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            'location': location && location.address && location.address.line1
                ? `${location.address.line1}, ${location.city && location.city.name ? location.city.name : ''}, ${location.state && location.state.name ? location.state.name : ''} ${location.postalCode ? location.postalCode : ''}`
                : location && location.name ? location.name : ''
        };


        try {
            const response = await fetch("http://localhost:5175/api/calendar-event", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${session.provider_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });
    
            if (!response.ok) {
                throw new Error('failed to create calendar event');
            }
    
            alert("event added to Google Calendar");
        } catch (error) {
            console.error("error creating calendar event:", error);
        }
    };
    
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="relative">
          <img 
            className="w-full h-48 object-cover"
            src={profPic} 
            alt="artist profile" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h3 className="text-white text-xl font-bold truncate">{name}</h3>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-400">
              <p className="font-medium">
                {date.localDate} • {date.localTime && date.localTime.slice(0,5)}
              </p>
            </div>
            
            {location && (
              <div className="flex items-start space-x-2 text-gray-300">
                <div>
                  <p className="font-medium">{location.name}</p>
                  {location.address && location.address.line1 && <p>{location.address.line1}</p>}
                  {location.city && location.city.name && <p>{location.city.name}, {location.state && location.state.name}</p>}
                </div>
              </div>
            )}
          </div>
    
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              {price.min !== undefined && (
                <p className="text-lg font-bold text-white">
                  {price.min === price.max ? `${price.min} ${price.currency}` : `${price.min} - ${price.max} ${price.currency}`}
                </p>
              )}
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${status === "onsale" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
                {status === "onsale" ? "On Sale" : "Canceled"}
              </span>
            </div>
            
            {session && status === "onsale" && (
              <button
                onClick={createCalendarEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300"
              >
                <span>Add to Calendar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
}