const router = puter.workers.router();

router.get('/validate', async (req, res) => {
    const token = req.query.get('token');
    if (!token) {
        return res.json({ success: false, error: 'Token not provided.' }, { status: 400 });
    }

    try {
        const db = puter.db('tokens');
        const existingToken = await db.findOne({ token: token });

        if (!existingToken) {
            return res.json({ success: false, error: 'Invalid token.' }, { status: 404 });
        }

        if (existingToken.is_used) {
            return res.json({ success: false, error: 'Token has already been used.' }, { status: 403 });
        }

        if (existingToken.expires_at && new Date(existingToken.expires_at) < new Date()) {
            return res.json({ success: false, error: 'Token has expired.' }, { status: 403 });
        }

        // Mark the token as used
        await db.updateOne({ _id: existingToken._id }, { $set: { is_used: true } });

        return res.json({
            success: true,
            expires_at: existingToken.expires_at
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return res.json({ success: false, error: 'An internal error occurred.' }, { status: 500 });
    }
});

export default router;
