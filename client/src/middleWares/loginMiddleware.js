export default  ({dispatch}) => next => async action => {
  if(!action.promise){
      return next(action);
  }

  const {promise, type, data, history, ...rest } = action;
   
  if(type === "USER"){
       let result = await promise(data);
  return next({...rest,history,result,type : `ADD_${type}`});
      }
      
}