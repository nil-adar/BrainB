
import { Router } from 'express';
import { UserProfileModel } from '../models/UserProfile';

const router = Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    let profile = await UserProfileModel.findOne({ userId });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new UserProfileModel({ userId });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      message: 'Error fetching user profile', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Update user profile
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    if (!userId || !updateData) {
      res.status(400).json({ message: 'User ID and update data are required' });
      return;
    }

    // Handle special case for assignedClasses
    if (updateData.assignedClasses) {
      // Ensure profile exists
      let profile = await UserProfileModel.findOne({ userId });
      
      if (!profile) {
        // Create new profile if it doesn't exist
        profile = new UserProfileModel({ 
          userId, 
          assignedClasses: updateData.assignedClasses 
        });
        await profile.save();
      } else {
        // Update existing profile's assignedClasses
        profile = await UserProfileModel.findOneAndUpdate(
          { userId },
          { assignedClasses: updateData.assignedClasses },
          { new: true }
        );
      }
      
      res.json(profile);
      return;
    }

    // Handle regular profile updates
    let profile = await UserProfileModel.findOne({ userId });
    
    if (!profile) {
      // Create new profile if it doesn't exist
      profile = new UserProfileModel({ userId, ...updateData });
      await profile.save();
    } else {
      // Update existing profile
      profile = await UserProfileModel.findOneAndUpdate(
        { userId },
        updateData,
        { new: true }
      );
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      message: 'Error updating user profile', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

export { router as profileRouter };
