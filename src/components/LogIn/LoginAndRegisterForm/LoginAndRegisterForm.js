import React from "react";

import "./LoginAndRegisterForm.scss";

const LoginAndRegisterForm = (
    {
        isRegisterForm,
        setIsRegisterForm,
        handleSubmit,
        handleChange,
        nameValue,
        passwordValue,
        emailValue,
        rememberMeValue,
    }
    ) => {




    let form;

    if (isRegisterForm) {
        form = <>
            <span className="text-center font-weight-bold">Register</span>
            <form className="form card-body" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input className="form-control" value={nameValue} onChange={handleChange} id="name" type="text" required/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">email</label>
                    <input className="form-control" value={emailValue} onChange={handleChange} id="email" type="email" required/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input className="form-control" value={passwordValue} onChange={handleChange} id="password" type="password" required />
                </div>

                <div className="form-group row">
                    <div className="col-6">
                        <button className="btn btn-primary" type="submit" id="signUpBtn">Register</button>
                    </div>
                    <div className="col-6 ">
                        <button className="btn btn-primary" onClick={() => setIsRegisterForm(!isRegisterForm)} type="button" id="signInBtn">back</button>
                    </div>

                </div>
            </form>
        </>;
    } else {
        form = <>
            <span className="text-center card-header font-weight-bold">Log in</span>
            <form className="form card-body" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input className="form-control" value={nameValue}
                           onChange={handleChange} id="name" type="text" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input className="form-control" value={passwordValue}
                           onChange={handleChange} id="password" type="password" required />
                </div>

                <div className="form-group d-flex align-items-center justify-content-between">
                    <label className="form-check-label mr-3" htmlFor="rememberMe">remember me</label>
                    <input className="mr-auto" value={rememberMeValue}
                           onChange={handleChange} id="rememberMe" type="checkbox" />
                </div>

                <div className="form-group row">
                    <div className="col-6">
                        <button className="btn btn-primary" onClick={() => setIsRegisterForm(!isRegisterForm)}
                                type="button" id="registerBtn">Register</button>
                    </div>
                    <div className="col-6 ">
                        <button className="btn btn-primary" type="submit"
                                id="signInBtn">Log in</button>
                    </div>

                </div>
            </form>
        </>;
    }

    return form

};

export default LoginAndRegisterForm