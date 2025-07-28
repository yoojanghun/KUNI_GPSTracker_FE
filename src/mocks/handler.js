import { http } from 'msw';

export const handlers = [
  http.get('/api/dashboard',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
  http.get('/api/dashboard/map',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
  http.get('/api/dashboard/status',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
  http.get('/api/location/:vehicleNumber',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
  http.get('/api/record',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
  http.get('/api/record/:recordId',(req, res, ctx) => { 
    return Response.json({massage: 'ok'});
   }),
];