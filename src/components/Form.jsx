import React, {useEffect, useState} from 'react'
import { Routes, Route, Outlet, useNavigate } from 'react-router'

export default function Form() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    paysYearly: false,
    plan: {},
    addOns: [],
  })
  const props = {currentStep ,setCurrentStep, formData, setFormData}

  function getStep(index){
  switch (index){
    case 0: return <StepOne {...props} />;
    case 1: return <StepTwo {...props} />;
    case 2: return <StepThree {...props} />;
    case 3: return <StepFour {...props} />;
    case 4: return <StepFive {...props} />;
  }
}
    
  return (
    <Routes>
      <Route element={<FormSharedLayout currentStep={currentStep}  />}>
        <Route index  element={getStep(currentStep)} />
      </Route>
      <Route path='*' element={<div className='mt-4 text-center font-bold text-2xl'>404 Not Found!</div>}/>
    </Routes>
  )
}

function FormSharedLayout({currentStep}){
  const steps = ["YOUR INFO","SELECT PLAN","ADD-ONS","SUMMARY"]
  return (
    <div className='relative bg-white w-[940px] h-max @desktop:mt-27 rounded-2xl @desktop:px-4 @desktop:pt-3.5 @desktop:pb-4.5 font-[Ubuntu] grid @desktop:grid-cols-[auto_1fr] mb-12.25'>
      <div className="min-w-[275px] min-h-43 px-8 py-8 bg-[url(/images/bg-sidebar-mobile.svg)] @desktop:rounded-[10px] bg-no-repeat bg-cover flex @max-desktop:justify-center items-start gap-x-4 gap-y-[24.5px] @desktop:min-h-[569px] @desktop:h-full @desktop:py-9.25 @desktop:bg-[url(/images/bg-sidebar-desktop.svg)] @desktop:flex-col ">
        {steps.map((step, i) => <Step key={step} stepNumber={i+1} title={step} isSelected={(currentStep == 4? 3: currentStep) == i}></Step>)}
      </div>
      <div className="absolute bg-white @max-lg:w-[91.5%] @max-desktop:w-[95.6%] @max-desktop:mt-24.5 @max-desktop:mx-4 @max-desktop:px-6 pt-7 rounded-xl @max-desktop:shadow @desktop:static @desktop:pl-24.75 @desktop:pr-21 @desktop:pt-9 @desktop:w-full">
        <Outlet></Outlet>
      </div>
    </div>
  )
}



/* ---------------------------------- steps ---------------------------------- */

function StepOne({currentStep,setCurrentStep, formData, setFormData}){
  const {name, email, tel} = formData;
  const [hasErrors, setHasErrors] = useState(false);
  const [data, setData] = useState({
    name: name,
    email: email,
    tel: tel,
  })
  const inputs = [
    {
      field: "name",
      label: "Name",
      placeholder: "e.g. Stephen King",
      validationFn: ()=>{
        if (new RegExp(/[0-9]/, "g").test(data.name)){
          setHasErrors(true)
          return "Invalid name!";
        } 
        if (data.name.length == 0){
          setHasErrors(true)
          return "This field is required"
        }
        if (data.name.length <= 3){
          setHasErrors(true)
          return "name is too short";
        } 
        setHasErrors(false)
        return ""
      }
    },
    {
      field: "email",
      label: "Email Address",
      placeholder: "e.g. stephenking@lorem.com",
      validationFn: ()=>{
        if (data.email.length == 0){
          setHasErrors(true)
          return "This field is required"
        }
        setHasErrors(false)
        return ""
      }
    },
    {
      field: "tel",
      label: "Phone Number",
      placeholder: "e.g. +1 234 567 890",
      validationFn: ()=>{
        if (data.tel.length == 0){
          setHasErrors(true)
          return "This field is required"
        }
        setHasErrors(false)
        return ""
      }
    },
  ];
  function handleSubmit(e){
    e.preventDefault();
    if (hasErrors) return;
    setFormData(oldData => ({...oldData, ...data}))
    setCurrentStep(s => s+1)
  }
  return (
    <div className='relative h-full pb-4'>
      <h1>Personal info</h1>
      <p className="text-cool-gray mb-5.75 @desktop:mb-9.25">Please provide your name, email address, and phone number.</p>
      <form className='' onSubmit={handleSubmit}>
        {inputs.map((input, i) => <FormInput {...input} key={i} data={data} setData={setData} />)}
        <NavigationBtns currentStep={currentStep} setCurrentStep={setCurrentStep}/>
      </form>
    </div>
  )
}


function StepTwo({setCurrentStep, setFormData, formData, currentStep}){
  const {plan, paysYearly} = formData;
  const [selectedPlan, setSelectedPlan] = useState(plan)
  const [hasError, setHasError] = useState(false)
  const plans = [
    {name: "Arcade", monthlyPrice: 9, yearlyPrice: 90},
    {name: "Advanced", monthlyPrice: 12, yearlyPrice: 120},
    {name: "Pro", monthlyPrice: 15, yearlyPrice: 150},
  ]

  function handleSubmit(e){
    e.preventDefault();
    if (!selectedPlan.name){
      setHasError(true)
    } else{
      setFormData(oldData => ({...oldData, plan: {...selectedPlan}}))
      setCurrentStep(s => s+1)
    }
  }
  return(
    <div className='relative h-full pb-8 pt-0.25'>
      <h1>Select your plan</h1>
      <p className='text-cool-gray text-base/relaxed mb-5.25 @lg:mb-9.25'>You have the option of monthly or yearly billing.</p>
      <form onSubmit={handleSubmit}>
        <div className='grid @md:grid-cols-3 gap-x-5 gap-y-2.75'>
          {plans.map(planProps => {
            return <Plan planProps={planProps} key={planProps.name} paysYearly={paysYearly} setSelectedPlan={setSelectedPlan} selectedPlan={selectedPlan} />
          })}
        </div>
        <div className='mt-5.5 @lg:mt-8 p-3.5 rounded bg-light-blue'>
          <label htmlFor="monthlyOrYearly" className='flex gap-x-6 justify-center items-center select-none @desktop:pr-3.5'>
            <input type="checkbox" id='monthlyOrYearly' checked={paysYearly} className='sr-only peer' onChange={()=> setFormData(d => ({...d, paysYearly: !paysYearly}))}/>
            <span className='text-marine-blue peer-checked:text-cool-gray font-[ubuntu-bold] order-0 text-sm'>Monthly</span>
            <span className='bg-marine-blue w-9.5 h-5 rounded-2xl relative cursor-pointer after:content-[""] after:absolute after:rounded-full after:mt-1 after:ml-1 after:h-3 after:w-3 after:bg-white peer-checked:after:translate-x-4 after:transition-all after:duration-200'></span>
            <span className='text-sm text-cool-gray font-bold peer-checked:text-marine-blue'>Yearly</span>
          </label>
        </div>
        {(hasError && !selectedPlan.name) && <div className='mt-4 text-center w-full text-red-600'>Please select a plan!</div>}
        <NavigationBtns currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </form>
    </div>
  )
}


function StepThree({setCurrentStep, currentStep, formData, setFormData}){
  const {paysYearly, addOns} = formData;
  const [selectedAddOns, setSelectedAddOns] = useState(addOns)
  const addOnsList = [
    {
      title: "Online service",
      description: "Access to multiplayer games",
      monthlyPrice: 1,
      yearlyPrice: 10,
    },
    {
      title: "Larger storage",
      description: "Extra 1TB of cloud save",
      monthlyPrice: 2,
      yearlyPrice: 20,
    },
    {
      title: "Customizable Profile",
      description: "Custom theme on your profile",
      monthlyPrice: 2,
      yearlyPrice: 20,
    }
  ]

  function handleSubmit(e){
    e.preventDefault();
    setFormData(data => ({...data, addOns: selectedAddOns}))
    setCurrentStep(s => s+1)
  }
  return(
    <div className='relative h-full @max-desktop:mb-8 @max-desktop:pt-0.5'>
      <h1>Pick add-ons</h1>
      <p className='mb-5.25 text-base/6.5 @lg:mb-9.5 text-cool-gray'>Add-ons help enhance your gaming experience.</p>
      <form className='space-y-3.5 @lg:space-y-4' onSubmit={handleSubmit}>
        {addOnsList.map(addonProps => <AddOnsCheckBox data={addonProps} key={addonProps.title} paysYearly={paysYearly} setSelectedAddOns={setSelectedAddOns} selectedAddOns={selectedAddOns} />)}
        <NavigationBtns currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </form>
    </div>
  )
}


function StepFour({setCurrentStep, currentStep, formData}){
  const {plan, paysYearly, addOns} = formData;
  const price = paysYearly? "yearlyPrice": "monthlyPrice";
  const subscription = paysYearly? "Year": "Month";
  const total = [plan[price], ...addOns.map(addOn => addOn[price])].reduce((a,b) => a+b);

  function handleSubmit(e){
    e.preventDefault()
    setCurrentStep(s => s+1)
  }
  

  return(
    <div className='relative h-full @max-desktop:mb-3 @max-desktop:mt-0.5'>
      <h1>Finishing up</h1>
      <p className='mb-5.5 text-base/6.5 @lg:mb-9.5 text-cool-gray'>Double-check everything looks OK before confirming.</p>
      <form className='border rounded-lg border-transparent px-3.75 pt-3.5 pb-2 @lg:pl-5.25 @lg:pr-5.5 @lg:py-4 bg-main-bg' onSubmit={handleSubmit}>
        <div className='flex justify-between items-center'>
          <div>
            <p className='text-sm/loose @lg:text-base semibold text-marine-blue leading-[100%] pt-0.5 @lg:pb-0.5'>{`${plan.name} (${subscription}ly)`}</p>
            <button className='underline cursor-pointer text-sm text-purplish-blue' onClick={() => setCurrentStep(1)}>Change</button>
          </div>
          <div>
            <p className='text-sm/tight @lg:text-base semibold text-marine-blue @max-sm:mt-0.75'>{formatPrice(plan[price], paysYearly)}</p>
          </div>
        </div>
        {!!addOns.length && ( 
          <>
            <div className='w-full h-[0.5px] bg-cool-gray/75 mt-2.75 @lg:mt-5.5' />
            <div className='mt-3 @lg:mt-4 space-y-2.5 @lg:space-y-3.5 mb-1'>
              {addOns.map(addOn => {
                return <p className='flex justify-between text-sm/5.5' key={addOn.title}>
                  <span className='text-cool-gray'>{addOn.title}</span> 
                  <span className='text-purplish-blue'>+{formatPrice(addOn[price], paysYearly)}</span>
                </p>
              })}
            </div>
          </>

        )}
        <NavigationBtns currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </form>
      <p className='flex justify-between py-5 px-4 @lg:px-6 items-center'>
        <span className='text-sm mt-1.5 text-cool-gray'>Total (per {subscription.toLowerCase()})</span>
        <span className='text-base @lg:text-xl mt-0.5 font-bold text-purplish-blue'>+{formatPrice(total, paysYearly)}</span>
      </p>
    </div>
  )
}

function StepFive(){
  return(
    <div className='text-center h-full pt-12.5 @desktop:pt-32.5 pb-20'>
      <img src="/images/icon-thank-you.svg" alt="check mark icon" className='w-14 mx-auto mb-5 @lg:mb-6.5' />
      <h1 className='mb-2.5'>Thank you!</h1>
      <p className='text-cool-gray text-base/6.25'>
        Thanks for confirming your subscription! We hope you have fun 
        using our platform. If you ever need support, please feel free 
        to email us at support@loremgaming.com.
      </p>
    </div>
  )
}

/* ---------------------------------- Components ---------------------------------- */

function FormInput({field, label, placeholder, validationFn, setData, data}){
  const [isTouched, setIsTouched] = useState(false)
  const value = data[field];
  let error = validationFn();
  const invalid = !!error && isTouched;
  function handleChange(e){
    setData(data => ({...data, [field]: e.target.value}))
    !isTouched && setIsTouched(true)
  }
  return(
    <div className='mb-3.5 @desktop:mb-5.5'>
      <label className="flex justify-between text-xs font-medium mt-0.25 mb-0.75 @desktop:text-sm @desktop:mb-1.75 text-marine-blue">
        <span>{label}</span>
        {invalid && <span className='text-red-500'>{error}</span>}
      </label>
      <input type={field} placeholder={placeholder} value={value} onChange={handleChange} className={`border block  w-full rounded-xs @desktop:rounded-md h-10 @lg:h-11.75 px-4 outline-0 ${invalid? 'border-red-500' :'border-light-gray focus:border-marine-blue'} `}  required/>
    </div>
  )
}

function Step(props){
  const {stepNumber, title, isSelected} = props;
  return(
    <div className="step text-white flex items-center gap-x-4 ">
      <div className={`border-2 semibold text-sm rounded-full border-pale-blue w-8.25 h-8.25 flex items-center justify-center mb-1 ${isSelected && "bg-pale-blue border-transparent text-marine-blue"}`}>
        {stepNumber}
      </div>
      <div className="text-pale-blue mb-1 hidden @desktop:block">
        <p className="text-xs my-0 ">STEP {stepNumber}</p>
        <p className="text-[0.85rem] tracking-widest font-bold text-white">{title}</p>
      </div>
    </div>
  )
}

function NavigationBtns({setCurrentStep, currentStep}){
  function handleClick(){
    setCurrentStep(prevStep => prevStep - 1)
  };
  return( 
    <div className='flex justify-between items-center absolute @max-desktop:-mx-4 @max-desktop:px-4 @max-desktop:h-15 @max-desktop:-left-6 @max-desktop:-right-6 @max-desktop:bg-white @max-desktop:-bottom-25 @desktop:bottom-4.5 right-0 left-0'>
      {currentStep != 0 ? <button 
      className={`inline-block text-sm @desktop:text-base text-cool-gray font-semibold cursor-pointer`} 
      type='button' 
      onClick={handleClick}>Go Back</button>: <span></span>}
      <button className={`inline-block h-10 w-24 rounded-md bg-marine-blue hover:bg-marine-blue/70 text-white cursor-pointer text-sm @desktop:text-base @desktop:rounded-lg @desktop:w-31 @desktop:h-12 @desktop:pb-0.75 semibold`}  type='submit'>{currentStep == 3? "Confirm": "Next Step"}</button>
    </div>
  )
}

function Plan({paysYearly, setSelectedPlan, selectedPlan, planProps}){
  const {yearlyPrice, monthlyPrice, name} = planProps;
  function handleClick(e){
    const newPlan = selectedPlan.name == name? {}: planProps;
    setSelectedPlan(newPlan)
  }
  return (
    <div className={`plan ${name == selectedPlan.name && "bg-main-bg border-cool-gray"}`} onClick={handleClick}>
      <img src={`/images/icon-${name}.svg`.toLowerCase()} alt="" className='w-[40px]' />
      <p className='leading-5.75'>
        <span className='block text-marine-blue font-bold text-[15px] @lg:mb-1'>{name}</span>
        <span className='text-sm block text-cool-gray'>
          {getPrice(monthlyPrice, yearlyPrice, paysYearly)}
        </span>
        {paysYearly && <span className='text-xs text-marine-blue'>2 months free</span>}
      </p>
    </div>
  )
}

function AddOnsCheckBox({data, paysYearly, setSelectedAddOns, selectedAddOns}){
  const {title, description, monthlyPrice, yearlyPrice} = data;
  const isChecked =  selectedAddOns.some(addOn => addOn.title == data.title)
  function handleClick(){
    setSelectedAddOns(addOns => {
      const addOnExists = !!addOns.find(addOn => addOn.title == data.title)
      if (addOnExists){
        return addOns.filter(addon => addon.title !== data.title)
      } else {
        return [...addOns, data]
      }
    })
  }
  return(
    <label htmlFor={title} className='select-none cursor-pointer grid grid-cols-[auto_1fr_auto] items-center border border-light-gray rounded-lg min-h-15 @desktop:min-h-20.25 px-3.75 @desktop:px-5.75 gap-x-4 @lg:gap-x-6.25 has-[input:checked]:bg-alabaster has-[input:checked]:ring-purplish-blue has-[input:checked]:ring-1'>
      <div className='mt-1'>
        <input type="checkbox" name={title} id={title} className='size-5 @desktop:size-5 accent-purplish-blue'  onChange={handleClick} checked={isChecked} />
      </div>
      <div className='mb-0.75 @desktop:mb-1'>
        <p className='font-bold text-[13.5px] @desktop:text-base @desktop:semibold text-marine-blue'>{title}</p>
        <p className='text-cool-gray text-xs @lg:text-[15px]'>{description}</p>
      </div>
      <div>
        <p className='text-xs @desktop:text-sm @desktop:font-bold text-purplish-blue'>+{getPrice(monthlyPrice, yearlyPrice, paysYearly)}</p>
      </div>

    </label>
  )
}

function getPrice(monthlyPrice, yearlyPrice, isYearly){
  return isYearly? `$${yearlyPrice}/yr`: `$${monthlyPrice}/mo`; 
}
function formatPrice(price, isYearly){
  return `$${price}/${isYearly? "yr": "mo"}`;
}
