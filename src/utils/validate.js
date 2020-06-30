export function isvalidUsername(value){
    console.log(value);

    return value !=="";
}
export function validateDate(date){
    //return false;
    console.log(date);
    
    var Date=date.split('-');
    if(Date.length!=3)
    {
        return false;
    }
    else
    {
        console.log(Date[0]);
        console.log(Date[1]);
        console.log(Date[2]);
        if(Date[1][0]=='0')
        {
            Date[1]=Date[1].slice(1);
        }
        if(Date[2][0]=='0')
        {
            Date[2]=Date[2].slice(1);
        }
        var yearrule=/^[0-9]*$/;
        if(!yearrule.test(Date[0])||!yearrule.test(Date[1])||!yearrule.test(Date[2]))
        {
            return false;
        }

        else if(Date[0].length!=4||Date[1].length>2||Date[2].length>2)
        {
            return false;
        }
        else if(Date[0]*1.0<2019||Date[1]<1||Date[1]>12||Date[2]<1||Date[2]>31)
        {
            return false;
        }
        //var yearrule=/[a+2019-a+9999]?$/;
        
        //return reg.test(Date[0]);
      //  var monthrule=/^[a+1-a+12]+$/;

       // var dayrule=/^[a+1-a+31]+$/;
        //if(Date[0]*1.0<2019||(Date[1]>13&&Date[1]<0)||)
        else
        {
            return true;
        }
        
        
    }
    
}
export function validateMobile(phone){
    var daterule=/^[0-9]*$/;
    if(!daterule.test(phone))
    {
        return false;
    }
    else if(phone.length!=11)
    {
        return false;
    }
    else if(phone[0]!='1')
    {
        return false;
    }
    else
    {
        return true;
    }
}
export function VerSource(form){
    // console.log(form.GuidanceSystem);
    // console.log(form.NetworkType);
    if(form.Type==null)
    {
        return "类型不能为空";
    }
    else if(form.Mountpoint==null)
    {
        return "挂载点不能为空"
    }
    else if(form.Identifier==null)
    {
        return "Identifier不能为空"
    }
    else if(form.RTCMFormat==null)
    {
        return "差分数据格式不能为空"
    }
    else if(form.IntervalTime==null)
    {
        return "数据发送频率不能为空"
    }
    else if(form.CarrierPhaseData==null)
    {
        return "载波相位数据不能为空"
    }
    else if(form.GuidanceSystem.length==0)
    {
        
        return "导航系统不能为空"
    }
 
    else if(form.NetworkType==null)
    {
        
        return "网络不能为空"
    }
    else if(form.Country==null)
    {
        return "国家不能为空"
    }
    else if(form.Latitude==null)
    {
        return "纬度不能为空"
    }
    else if(form.Longitude==null)
    {
        return "经度不能为空"
    }
    else if(form.NeedNMEA==null)
    {
        return "发送NMEA不能为空";
    }
    else if(form.BasetationType==null)
    {
        return "基站类型不能为空"
    }
    else if(form.NameOfSoftware==null)
    {
        return "软件名称不能为空"
    }
    else if(form.CompactionAlgorithm==null)
    {
        return "压缩算法不能为空"
    }
    else if(form.VisitProtectType==null)
    {
        return "访问保护不能为空"
    }
    else if(form.YORN==null)
    {
        return "Y/N不能为空"
    }
    else if(form.Bitrate==null)
    {
        return "比特率不能为空"
    }
    else
    {
        var daterule=/^[0-9]*$/;
 
        var lat=form.Latitude.split('.');
        for(var i=0;i<lat.length;i++)
        {
            if(!daterule.test(lat[i]))
            {
                return "纬度输入不合法";
            }
        }
    
        
        var lon=form.Longitude.split('.');
        for(var i=0;i<lon.length;i++)
        {
            if(!daterule.test(lon[i]))
            {
                return "经度输入不合法";
            }
        }
    

        var bit=form.Bitrate;
        for(var i=0;i<bit.length;i++)
        {
            if(!daterule.test(bit[i]))
            {
                return "比特率输入不合法";
            }
        }
        
       
        return true;
   
    }
    
}