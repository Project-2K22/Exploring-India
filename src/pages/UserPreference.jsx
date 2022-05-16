import React, { useState } from 'react';
import { Paper, Box, Stepper, Step, StepLabel, Button, Typography, Stack } from '@mui/material';

import BaseContainer from '../components/BaseContainer';

const steps = [
    'Places you like',
    'Length of trip',
    'Places you like to visit',
    'Favourite weather',
    'Turn on location',
];

const questions = [
    'Which type of places you like to visit?',
    'What kind of trip you want to do?',
    'Do you like to visit place outside your state?',
    'Which weather is favourite to you for trip?',
    'Please click the button to turn of location.',
];

const options = [
    ['Mountain', 'Beach', 'Desert', 'Historical'],
    ['Long', 'Short', 'Depends on you'],
    ['Yes', 'No'],
    ['Summer', 'Winter', 'Spring', 'Autumn', 'Rain'],
    ['Turn On'],
];

const UserPreference = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    const isStepOptional = step => {
        return false;
    };

    const isStepSkipped = step => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <BaseContainer w="lg">
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} sx={{ marginY: '30px' }}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Paper sx={{ paddingX: '20px', paddingY: '10px' }}>
                            <Stack spacing={5}>
                                <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                                    {questions[activeStep]}
                                </Typography>
                                <Stack spacing={4} direction="row">
                                    {options[activeStep].map((option, key) => (
                                        <Button variant="outlined" size="large" key={key}>
                                            {option}
                                        </Button>
                                    ))}
                                </Stack>
                            </Stack>
                        </Paper>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>
                        </Box>
                    </React.Fragment>
                )}
            </Box>
        </BaseContainer>
    );
};

export default UserPreference;
