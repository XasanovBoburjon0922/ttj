/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        PATH_URL:'http://nbtuit.pythonanywhere.com/swagger'
    },
    images:{
        domains: ['3.70.236.23']
    }
};

export default nextConfig;
