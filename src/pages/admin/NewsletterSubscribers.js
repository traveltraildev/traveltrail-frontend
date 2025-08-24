import React, { useState, useEffect } from 'react';
import { getNewsletterSubscribers } from '../../endpoints';

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await fetch(getNewsletterSubscribers, {
          headers: {
            'Authorization': `AdminToken ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await response.json();
        setSubscribers(data.subscribers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Newsletter Subscribers</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed At</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map(subscriber => (
            <tr key={subscriber._id}>
              <td>{subscriber.email}</td>
              <td>{new Date(subscriber.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsletterSubscribers;