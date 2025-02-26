import React, { useState, useEffect } from "react";
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import Navbar from "./Navbar";
import Instance from "./Instance";

export default function App() {
    const [concerts, setConcerts] = useState([]);
    const [name, setName] = useState("");
    const session = useSession();
    const supabase = useSupabaseClient();
    const [isLoading, setIsLoading] = useState(false);

    const googleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar'
            }
        });
        if (error) {
            alert("error logging in to Google with Supabase");
            console.error(error);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };
    
    const fetchArtistImage = async (artistName) => {
        setIsLoading(true);
        try {
            const tokenResponse = await fetch("http://localhost:5175/api/spotify-token");
            const tokenData = await tokenResponse.json();
            if (!tokenData.accessToken) {
                throw new Error('no access token found');
            }
    
            const token = tokenData.accessToken;
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("failed to fetch artist image");
            }
            
            const data = await response.json();
            const artist = data.artists.items.length > 0 ? data.artists.items[0] : null;
            return artist && artist.images.length > 0 ? artist.images[0].url : null;
        } catch (error) {
            console.error(`error fetching image for ${artistName}:`, error);
            return null;
        }
    };
    

    const fetchConcerts = async () => {
        try {
            const response = await fetch(`http://localhost:5175/api/concerts?artist=${encodeURIComponent(name)}`);
     
            if (!response.ok) {
                throw new Error(`http error status: ${response.status}`);
            }
     
            const data = await response.json();
            if (data._embedded && data._embedded.events) {
                let events = data._embedded.events;

                events = events.filter((event) => 
                  event.name && event.name.toLowerCase().includes(name.toLowerCase())
                );

                const concertsWithImages = await Promise.all(
                    events.map(async (event) => {
                        const artistName = event.name;
                        const image = await fetchArtistImage(artistName);
                        return { ...event, artistImage: image };
                    })
                );
                
            setConcerts(concertsWithImages);
            } 
            else {
                setConcerts([]);
            }
        } catch (error) {
            console.error("error fetching concert data:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
      if (!name) return;
      fetchConcerts();
    }, [name]);


    if (isLoading) {
      return <div className="flex justify-center items-center h-screen bg-black text-white">Loading...</div>;
    }

    const concertElements = concerts.map((item) => (
        <Instance
            key={item.id}
            name={item.name}
            date={item.dates.start}
            price={item.priceRanges && item.priceRanges.length > 0 ? item.priceRanges[0] : "N/A"}
            location={item._embedded && item._embedded.venues && item._embedded.venues.length > 0 ? item._embedded.venues[0] : null}
            artistImage={item.artistImage}
            status={item.dates.status.code}
        />
    ));

    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-end p-4 space-x-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 text-sm font-medium">
                  {session.user.email}
                </span>
                <button 
                  onClick={signOut} 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={googleSignIn}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Sign in with Google
              </button>
            )}
          </div>
          
          <Navbar setName={setName} />

          {!isLoading && (
            <div className="py-8">
              {concerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {concertElements}
                </div>
              ) : 
              (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-xl">
                    {name ? "No concerts found" : "Search for your favorite artist"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
}